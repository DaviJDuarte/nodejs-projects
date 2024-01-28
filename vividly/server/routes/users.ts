import _ from 'lodash';
import {Router, Request, Response} from "express";
import {ValidationError} from "joi";
import {UserModel, userValidator} from "../models/user";
import {HydratedDocument} from "mongoose";
import bcrypt from 'bcrypt';
import {models} from "../types";
import IUser = models.IUser;
import asyncWrapper from "../middleware/asyncWrapper";

const router: Router = Router();

router.post('/', asyncWrapper(async (req: Request, res: Response) => {
    const {error}: { error: ValidationError | undefined } = userValidator(req.body);
    if (error)
        return res.status(400).json({message: error.message});

    const existingUser: HydratedDocument<IUser> | null = await UserModel.findOne({email: req.body.email});
    if (existingUser)
        return res.status(400).json({message: "Email already in use."});

    const newUser: HydratedDocument<IUser> = new UserModel(_.pick(req.body, ['name', 'email', 'password']));

    const salt: string = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);

    await newUser.save();

    const token: string = newUser.generateAuthToken();
    return res.header('x-Auth-Token', token)
        .json(_.pick(newUser, ['_id', 'name', 'email']));
}));

export default router;