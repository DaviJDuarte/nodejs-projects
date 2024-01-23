import _ from 'lodash';
import {Router, Request, Response} from "express";
import {ValidationError} from "joi";
import {UserModel, userValidator} from "../models/user";
import {HydratedDocument} from "mongoose";
import {models} from "../types";
import IUser = models.IUser;

const router: Router = Router();

router.post('/', async (req: Request, res: Response) => {
    const {error}: { error: ValidationError | undefined } = userValidator(req.body);
    if (error)
        return res.status(400).json({message: error.message});

    const existingUser: HydratedDocument<IUser> | null = await UserModel.findOne({email: req.body.email});
    if (existingUser)
        return res.status(400).json({message: "Email already in use."});

    const newUser: HydratedDocument<IUser> = new UserModel(_.pick(req.body, ['name', 'email', 'password']));
    await newUser.save();

    return res.json(_.pick(newUser, ['_id', 'name', 'email']));
});

export default router;