import mongoose from "mongoose";
import {Request, Response, NextFunction} from "express";

export default function (req: Request, res: Response, next: NextFunction) {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({message: "The provided ObjectId is invalid!"});
    }

    next();
}