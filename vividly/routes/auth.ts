import {Router, Request, Response} from "express";
import {models} from "../types";
import IUser = models.IUser;
import Joi, {ValidationError} from "joi";
import {UserModel} from "../models/user";
import bcrypt from "bcrypt";

const router: Router = Router();

router.post('/', async (req: Request, res: Response) => {
    const {error}: { error: ValidationError | undefined } = validateLogin(req.body);
    if (error)
        return res.status(400).json({message: error.message});

    const user: IUser | null = await UserModel.findOne({email: req.body.email});
    if (!user)
        return res.status(400).json({message: "Invalid email and/or password"});

    const validPassword: boolean = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword)
        return res.status(400).json({message: "Invalid email and/or password"});

    const token: string = user.generateAuthToken();
    return res.json(token);
});

const validateLogin = (user: IUser) => {
    const schema = Joi.object({
        email: Joi.string().email().min(5).max(255).required(),
        password: Joi.string().min(8).max(100).required(),
    });

    return schema.validate(user);
};

export default router;