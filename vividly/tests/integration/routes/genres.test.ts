import server from "../../../server";
import request from "supertest";
import {GenreModel} from "../../../server/models/genre";
import {models} from "../../../server/types";
import IGenre = models.IGenre;
import mongoose, {HydratedDocument} from "mongoose";
import {UserModel} from "../../../server/models/user";

describe('/api/genres', () => {
    const base: string = "/api/genres";

    afterEach(async () => {
        server.close();
        await GenreModel.deleteMany();
    });

    describe('GET /', () => {
        it('should return a list with all the genres', async () => {
            await GenreModel.insertMany([
                {name: "genre1"},
                {name: "genre2"}
            ]);

            const res = await request(server).get(base);
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(
                (genre: IGenre) => genre.name === "genre1")
            ).toBeTruthy();
        });
    });

    describe('GET /:id', () => {
        it('should return a 400 status code if the id is not a valid ObjectID', async () => {
            const res = await request(server).get(`${base}/1`);
            expect(res.status).toBe(400);
        });

        it('should return a 404 status code if ID is valid but there are no genres with given ID', async () => {
            const id: string = new mongoose.Types.ObjectId().toHexString();
            const res = await request(server).get(`${base}/${id}`);
            expect(res.status).toBe(404);
        });

        it("should return a genre if it exists", async () => {
            const genre: HydratedDocument<IGenre> = new GenreModel({
                name: "genre1"
            });

            await genre.save();

            const res = await request(server).get(`${base}/${genre._id}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("name", genre.name);
        });
    });

    describe('POST /', () => {
        it('should return a 401 status code if the client is not logged in', async () => {
            const res = await request(server)
                .post(base)
                .send({name: "genre"});

            expect(res.status).toBe(401);
        });

        it.each([
            new Array(52).join('a'),
            'a'
        ])('should return a 400 status code if the genre object is invalid', async (name: string) => {
            // Genre is invalid if its name is less than 3 or more than 50 characters long.

            const token: string = new UserModel().generateAuthToken();

            const res = await request(server)
                .post(base)
                .set('x-Auth-Token', token)
                .send({name});

            expect(res.status).toBe(400);
        });

        it('should save the genre if it is valid', async () => {
            const genre: IGenre = {
                name: "genre1"
            };

            const token: string = new UserModel().generateAuthToken();

            await request(server)
                .post(base)
                .set('x-Auth-Token', token)
                .send(genre);

            const dbGenre: IGenre | null = await GenreModel.findOne(genre);

            expect(dbGenre).not.toBeNull();
        });

        it('should return the genre if it is valid', async () => {
            const genre: IGenre = {
                name: "genre1"
            };

            const token: string = new UserModel().generateAuthToken();

            const res = await request(server)
                .post(base)
                .set('x-Auth-Token', token)
                .send(genre);

            expect(res.body).toHaveProperty("_id");
            expect(res.body).toHaveProperty("name", genre.name);
        });
    });

    describe('PUT /:id', () => {
        it('should return a 400 status code if the id is not a valid ObjectId', async () => {
            const res = await request(server)
                .put(`${base}/1`)
                .send({name: "genre1"});

            expect(res.status).toBe(400);
        });

        it('should return a 400 status code if the genre object is invalid', async () => {
            const res = await request(server)
                .put(`${base}/${new mongoose.Types.ObjectId().toHexString()}`)
                .send({});

            expect(res.status).toBe(400);
        });

        it('should return a 404 status code if there are no genres with given ID', async () => {
            const res = await request(server)
                .put(`${base}/${new mongoose.Types.ObjectId().toHexString()}`)
                .send({name: "genre1"});

            expect(res.status).toBe(404);
        });

        it('should update the genre if it exists', async () => {
            const genre: HydratedDocument<IGenre> = new GenreModel({
                name: "genre1"
            });

            await genre.save();

            await request(server)
                .put(`${base}/${genre._id}`)
                .send({name: "genre2"});

            const updated_genre: HydratedDocument<IGenre> | null = await GenreModel.findById(genre._id);

            expect(updated_genre).not.toBeNull();
            expect(updated_genre).toHaveProperty("name", "genre2");
        });

        it('should return the updated genre if it successfully updates', async () => {
            const genre: HydratedDocument<IGenre> = new GenreModel({
                name: "genre1"
            });

            await genre.save();

            const res = await request(server)
                .put(`${base}/${genre._id}`)
                .send({name: "genre2"});

            expect(res.body).toHaveProperty("name", "genre2");
        });
    });

    describe('DELETE /:id', () => {
        it('should return a 401 status code if the user is not logged in', async () => {
            const res = await request(server)
                .delete(`${base}/${new mongoose.Types.ObjectId().toHexString()}`);

            expect(res.status).toBe(401);
        });

        it('should return a 403 status code if the user is not an admin', async () => {
            const token: string = new UserModel().generateAuthToken();

            const res = await request(server)
                .delete(`${base}/${new mongoose.Types.ObjectId().toHexString()}`)
                .set('x-Auth-Token', token);

            expect(res.status).toBe(403);
        });

        it('should return a 400 status code if the id is not a valid ObjectId', async () => {
            const token: string = new UserModel({isAdmin: true}).generateAuthToken();

            const res = await request(server)
                .delete(`${base}/1`)
                .set('x-Auth-Token', token);

            expect(res.status).toBe(400);
        });

        it('should return a 404 status code if there are no genres with given ID', async () => {
            const token: string = new UserModel({isAdmin: true}).generateAuthToken();

            const res = await request(server)
                .delete(`${base}/${new mongoose.Types.ObjectId().toHexString()}`)
                .set('x-Auth-Token', token);

            expect(res.status).toBe(404);
        });

        it('should delete genre if it exists', async () => {
            const genre: HydratedDocument<IGenre> = new GenreModel({
                name: "genre1"
            });

            await genre.save();

            const token: string = new UserModel({isAdmin: true}).generateAuthToken();

            await request(server)
                .delete(`${base}/${genre._id}`)
                .set('x-Auth-Token', token);

            const deleted_genre: HydratedDocument<IGenre> | null = await GenreModel.findById(genre._id);

            expect(deleted_genre).toBeNull();
        });

        it('should return the deleted genre if it successfully deletes', async () => {
            const genre: HydratedDocument<IGenre> = new GenreModel({
                name: "genre1"
            });

            await genre.save();

            const token: string = new UserModel({isAdmin: true}).generateAuthToken();

            const res = await request(server)
                .delete(`${base}/${genre._id}`)
                .set('x-Auth-Token', token);

            expect(res.body).toHaveProperty("name", genre.name);
        });
    });
});