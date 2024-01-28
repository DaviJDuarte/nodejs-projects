import {global, models} from "../../../server/types";
import IUser = models.IUser;
import {HydratedDocument} from "mongoose";
import {UserModel} from "../../../server/models/user";
import auth from "../../../server/middleware/auth";
import AuthRequest = global.AuthRequest;
import {Response} from "express";

describe('auth middleware', () => {
    it('should populate req.user with the proper payload', () => {
        const user: HydratedDocument<IUser> = new UserModel({
            name: "username",
            email: "test@test.com",
            password: "Password123"
        });

        // Need to update mocking of interfaces with a better solution
        const token: string = user.generateAuthToken();
        const req = {
            header: jest.fn().mockReturnValue(token)
        } as unknown as AuthRequest;
        const res = {} as unknown as Response;
        const next = jest.fn();

        auth(req, res, next);

        expect(req.user?._id.toString()).toBe(user._id.toString());
        expect(req.user).toHaveProperty('isAdmin', user.isAdmin);
    });
});