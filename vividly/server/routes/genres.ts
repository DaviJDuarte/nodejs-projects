import {Request, Response, Router,} from "express";
import {GenreModel, genreValidator} from "../models/genre";
import mongoose, {HydratedDocument} from "mongoose";
import {ValidationError} from "joi";
import {global, models} from "../types";
import IGenre = models.IGenre;
import auth from "../middleware/auth";
import AuthRequest = global.AuthRequest;
import admin from "../middleware/admin";
import asyncWrapper from "../middleware/asyncWrapper";

const router: Router = Router();

router.get('/', asyncWrapper(async (_req: Request, res: Response) => {
    const genres: IGenre[] = await GenreModel.find();
    return res.json(genres);
}));

router.get('/:id', asyncWrapper(async (req: Request, res: Response) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({message: "The provided ID is invalid!"});
    }

    const genre: IGenre | null = await GenreModel.findById(req.params.id);

    if (!genre) return res.status(404).json({message: `No resource found with id(${req.params.id}).`});

    return res.json(genre);

}));


router.post('/', auth, asyncWrapper(async (req: AuthRequest, res: Response) => {
    const {error}: { error: ValidationError | undefined } = genreValidator(req.body);

    if (error) return res.status(400).json({message: error.message});

    const genre: HydratedDocument<IGenre> = new GenreModel({
        name: req.body.name
    });

    const result: IGenre = await genre.save();
    return res.json({new_genre: result});
}));

router.put('/:id', asyncWrapper(async (req: Request, res: Response) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({message: "The provided ID is invalid!"});
    }

    const {error}: { error: ValidationError | undefined } = genreValidator(req.body);
    if (error) return res.status(400).json({message: error.message});

    const genre: IGenre | null = await GenreModel.findByIdAndUpdate(req.params.id, {
        name: req.body.name
    });

    if (!genre) return res.status(404).json({message: `No resource found with id(${req.params.id}).`});

    return res.json({updated_genre: genre});
}));

router.delete('/:id', [auth, admin], asyncWrapper(async (req: Request, res: Response) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({message: "The provided ID is invalid!"});
    }

    const genre: IGenre | null = await GenreModel.findByIdAndDelete(req.params.id);

    if (!genre) return res.status(404).json({message: `No resource found with id(${req.params.id}).`});

    return res.json({deleted: genre});
}));

export default router;