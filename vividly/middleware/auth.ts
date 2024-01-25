import {NextFunction, Response} from "express";
import jwt from "jsonwebtoken";
import config from "config";
import {global} from "../types";
import AuthRequest = global.AuthRequest;
import DataStoredInToken = global.DataStoredInToken;

export default function (req: AuthRequest, res: Response, next: NextFunction) {
    const token: string | undefined = req.header('x-Auth-Token');
    if (!token) return res.status(401).json({message: 'Access denied. No token provided'});

    try {
        req.user = jwt.verify(token, config.get('jwtPrivateKey')) as DataStoredInToken;
        next();
    } catch (e) {
        return res.status(401).json({message: 'Invalid token.'});
    }
}