import server from "../../server";
import request from "supertest";
import {GenreModel} from "../../server/models/genre";
import {models} from "../../server/types";
import IGenre = models.IGenre;
import mongoose, {HydratedDocument} from "mongoose";

describe('/api/genres', () => {
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

            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(
                (genre: IGenre) => genre.name === "genre1")
            ).toBeTruthy();
        });
    });

    describe('GET /:id', () => {
        it('should return a 400 status code if the id is not a valid ObjectID', async () => {
            const res = await request(server).get('/api/genres/1');
            expect(res.status).toBe(400);
        });

        it('should return a 404 status code if ID is valid but there are no genres with given ID', async () => {
            const id: string = new mongoose.Types.ObjectId().toHexString();
            const res = await request(server).get(`/api/genres/${id}`);
            expect(res.status).toBe(404);
        });

        it("should return a genre if it exists", async () => {
            const genre: HydratedDocument<IGenre> = new GenreModel({
                name: "genre1"
            });

            await genre.save();

            const res = await request(server).get(`/api/genres/${genre._id}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("name", genre.name);
        });
    });
});