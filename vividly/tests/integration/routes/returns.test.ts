import server from "../../../server";
import {RentalModel} from "../../../server/models/rental";
import {models} from "../../../server/types";
import IRental = models.IRental;
import mongoose, {HydratedDocument, Types} from "mongoose";
import request from "supertest";
import {UserModel} from "../../../server/models/user";
import moment from "moment";
import {MovieModel} from "../../../server/models/movie";
import IMovie = models.IMovie;
import arrayContaining = jasmine.arrayContaining;

describe('/api/returns', () => {
    const base: string = '/api/returns';
    let rental: HydratedDocument<IRental>;
    let customerId: Types.ObjectId | '' | 'invalidId';
    let movieId: Types.ObjectId | '' | 'invalidId';
    let movie: HydratedDocument<IMovie>;
    let token: string;

    const exec = () => {
        return request(server)
            .post(base)
            .send({customerId, movieId})
            .set('x-Auth-Token', token);
    };

    beforeEach(async () => {
        token = new UserModel().generateAuthToken();
        customerId = new mongoose.mongo.ObjectId();
        movieId = new mongoose.mongo.ObjectId();

        movie = new MovieModel({
            _id: movieId,
            title: "12345",
            genre: {name: "12345"},
            numberInStock: 10,
            dailyRentalRate: 2
        });

        await movie.save();

        rental = new RentalModel({
            customer: {
                _id: customerId,
                name: 'customer1',
                phone: '12345'
            },
            movie: {
                _id: movieId,
                title: 'movie1',
                dailyRentalRate: 2
            }
        });
        await rental.save();
    });

    afterEach(async () => {
        await RentalModel.deleteMany();
        server.close();
    });

    it('should return a 401 status code if client is not logged in', async () => {
        token = '';
        const res = await exec();
        expect(res.status).toBe(401);
    });

    it('should return a 400 status code if customerId is not provided', async () => {
        customerId = '';
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return a 400 status code if movieId is not provided', async () => {
        movieId = '';
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return a 400 status code if customerId is not valid', async () => {
        customerId = 'invalidId';
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return a 400 status code if movieId is not valid', async () => {
        movieId = 'invalidId';
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return a 404 status code if rental does not exist', async () => {
        await RentalModel.deleteMany();
        const res = await exec();
        expect(res.status).toBe(404);
    });

    it('should return a 400 status code if the return has already been processed', async () => {
        rental.dateReturned = new Date();
        await rental.save();
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return a 200 status code if the request is valid', async () => {
        const res = await exec();
        expect(res.status).toBe(200);
    });

    it('should set the rental return date if the request is valid', async () => {
        await exec();
        const returnedRental: HydratedDocument<IRental> | null = await RentalModel.findById(rental._id);

        if (returnedRental && returnedRental.dateReturned) {
            const diff: number = new Date().getTime() - returnedRental.dateReturned.getTime() || 0;

            expect(diff).toBeLessThan(10 * 1000);
            expect(returnedRental.dateReturned).toBeDefined();
        } else {
            fail('Rental not found');
        }
    });

    it('should set the rental fee if the request is valid', async () => {
        rental.dateOut = moment().add(-7, 'days').toDate();
        await rental.save();

        await exec();
        const returnedRental: HydratedDocument<IRental> | null = await RentalModel.findById(rental._id);
        console.log(returnedRental);

        expect(returnedRental?.rentalFee).toBe(rental.movie.dailyRentalRate * 7);
    });

    it('should increase the movies available stock when request is valid', async () => {
        await exec();

        const updatedMovie: HydratedDocument<IMovie> | null = await MovieModel.findById(movieId);

        if (updatedMovie) {
            const diff: number = updatedMovie.numberInStock - movie.numberInStock;
            expect(diff).toBe(1);
        } else {
            fail('Could not find movie');
        }
    });

    it('should return the rental object when request is valid', async () => {
        const res = await exec();

        const updatedRental: HydratedDocument<IRental> | null = await RentalModel.findById(rental._id);

        if (updatedRental) {
            expect(Object.keys(res.body)).toEqual(
                expect.arrayContaining([
                    'customer',
                    'movie',
                    'rentalFee',
                    'dateOut',
                    'dateReturned'
                ]));
        } else {
            fail('Could not find rental');
        }
    });
});
