import {UserModel} from "../../../server/models/user";
import mongoose from "mongoose";
import {global, models} from "../../../server/types";
import IUser = models.IUser;
import jwt from "jsonwebtoken";
import config from "config";
import DataStoredInToken = global.DataStoredInToken;

describe('user.generateAuthToken', () => {
    it('should generate a valid JWT', () => {
        const payload: DataStoredInToken = {
            _id: new mongoose.Types.ObjectId().toHexString(),
            isAdmin: true
        };

        const user: IUser = new UserModel(payload);
        const token: string = user.generateAuthToken();
        const decoded = jwt.verify(token, config.get('jwtPrivateKey')) as DataStoredInToken;
        expect(decoded).toMatchObject(payload);
    });
});