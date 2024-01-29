import {Request, Response, Router,} from "express";
import {GenreModel, genreValidator} from "../models/genre";
import {HydratedDocument} from "mongoose";
import {global, models} from "../types";
import IGenre = models.IGenre;
import auth from "../middleware/auth";
import AuthRequest = global.AuthRequest;
import admin from "../middleware/admin";
import asyncWrapper from "../middleware/asyncWrapper";
import validateObjectId from "../middleware/validateObjectId";
import validateRequestBody from "../middleware/validateRequestBody";

const router: Router = Router();

router.get('/', asyncWrapper(async (_req: Request, res: Response) => {
    const genres: IGenre[] = await GenreModel.find();
    return res.json(genres);
}));

router.get('/:id', validateObjectId, asyncWrapper(async (req: Request, res: Response) => {
    const genre: IGenre | null = await GenreModel.findById(req.params.id);

    if (!genre) return res.status(404).json({message: `No resource found with id(${req.params.id}).`});

    return res.json(genre);

}));


router.post('/', [auth, validateRequestBody(genreValidator)], asyncWrapper(async (req: AuthRequest, res: Response) => {
    const genre: HydratedDocument<IGenre> = new GenreModel({
        name: req.body.name
    });

    const result: IGenre = await genre.save();
    return res.json(result);
}));

router.put('/:id', [validateObjectId, validateRequestBody(genreValidator)], asyncWrapper(async (req: Request, res: Response) => {
    const genre: IGenre | null = await GenreModel.findByIdAndUpdate(req.params.id, {
            name: req.body.name
        },
        {new: true});

    if (!genre) return res.status(404).json({message: `No resource found with id(${req.params.id}).`});

    return res.json(genre);
}));

router.delete('/:id', [auth, admin, validateObjectId], asyncWrapper(async (req: Request, res: Response) => {
    const genre: IGenre | null = await GenreModel.findByIdAndDelete(req.params.id);

    if (!genre) return res.status(404).json({message: `No resource found with id(${req.params.id}).`});

    return res.json(genre);
}));

export default router;