import {Request, Response, NextFunction} from "express";
import {ValidationError} from "joi";

export default function (validator: (body: any) => { error: ValidationError | undefined; }) {
    return (req: Request, res: Response, next: NextFunction) => {
        const {error}: { error: ValidationError | undefined } = validator(req.body);
        if (error) return res.status(400).json(error.message);
        next();
    };
}