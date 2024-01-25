import {global} from "../types";
import AuthRequest = global.AuthRequest;
import {Response, NextFunction} from "express";

export default function (req: AuthRequest, res: Response, next: NextFunction) {
    if (!req.user?.isAdmin) return res.status(403).json({message: 'Access denied.'});

    next();
}