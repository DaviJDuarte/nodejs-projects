import {Model, Schema, model} from "mongoose";
import Joi from "joi";
import passwordComplexity from 'joi-password-complexity'
import {models} from "../types";
import IUser = models.IUser;

export const userSchema: Schema<IUser> = new Schema<IUser>({
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
    }
});

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
