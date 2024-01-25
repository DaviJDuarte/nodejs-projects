import {Model, Schema, model} from "mongoose";
import Joi from "joi";
import passwordComplexity from 'joi-password-complexity'
import {models} from "../types";
import IUser = models.IUser;
import jwt from "jsonwebtoken";
import config from "config";

const userSchema: Schema<IUser> = new Schema<IUser>({
    name: {
        type: String,
        required: true,
        min: 1,
        max: 100
    },
    email: {
        type: String,
        required: true,
        unique: true,
        min: 5,
        max: 255
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

userSchema.methods.generateAuthToken = function (): string {
    return jwt.sign({
        _id: this._id,
        isAdmin: this.isAdmin
    }, config.get('jwtPrivateKey'));
};

export const UserModel: Model<IUser> = model<IUser>('User', userSchema);

export const userValidator = (user: IUser) => {
    const complexityOptions: {} = {
        min: 8,
        max: 100,
        lowerCase: 1,
        upperCase: 1,
        numeric: 1,
        requirementCount: 5
    };

    const schema = Joi.object({
        name: Joi.string().min(1).max(100).required(),
        email: Joi.string().email().min(5).max(255).required(),
        password: passwordComplexity(complexityOptions)
    });

    return schema.validate(user);
};
