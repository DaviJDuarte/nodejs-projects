import {Request, Response, NextFunction} from "express";
import logger from "../logger/logger";

export default function (err: Error, _req: Request, res: Response, _next: NextFunction) {
    logger.error(err.message, err);
    return res.status(500).json({message: 'Something went wrong.'});
}