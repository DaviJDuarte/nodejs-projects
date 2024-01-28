import request from "supertest";
import server from "../../../server";
import {GenreModel} from "../../../server/models/genre";
import {UserModel} from "../../../server/models/user";

describe('auth middleware', () => {
    afterEach(async () => {
        server.close();
        await GenreModel.deleteMany();
    });

    let token: string;

    const exec = () => {
        return request(server)
            .post('/api/genres')
            .set('X-Auth-Token', token)
            .send({name: 'genre1'});
    };

    it('should return a 401 status code if no token is provided', async () => {
        token = '';
        const res = await exec();
        expect(res.status).toBe(401);
    });

    it('should return a 400 status code if token is invalid', async () => {
        token = 'a';
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return a 200 status code if token is valid', async () => {
        token = new UserModel().generateAuthToken();
        const res = await exec();
        expect(res.status).toBe(200);
    });
});