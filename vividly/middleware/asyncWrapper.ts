import {NextFunction, RequestHandler, Request, Response} from "express";

export default function (handler: RequestHandler) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await (handler as (req: Request, res: Response, next: NextFunction) => Promise<any>)(req, res, next);
        } catch (ex) {
            next(ex);
        }
    };
};
