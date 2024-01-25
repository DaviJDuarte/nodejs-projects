import {Request, Response, NextFunction} from "express";

export default function (err: Error, _req: Request, res: Response, _next: NextFunction) {
    console.log(err);
    return res.status(500).json({message: 'Something went wrong.'});
}