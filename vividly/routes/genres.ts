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

router.get('/', async (_req: Request, res: Response) => {
    try {
        const genres: IGenre[] = await GenreModel.find();
        return res.json(genres);
    } catch (ex) {
        res.status(500).json(ex);
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({message: "The provided ID is invalid!"});
    }

    try {
        const genre: IGenre | null = await GenreModel.findById(req.params.id);

        if (!genre) return res.status(404).json({message: `No resource found with id(${req.params.id}).`});

        return res.json(genre);
    } catch (ex) {
        return res.status(500).json(ex);
    }
});


router.post('/', auth, asyncWrapper(async (req: AuthRequest, res: Response) => {
    const {error}: { error: ValidationError | undefined } = genreValidator(req.body);

    if (error) return res.status(400).json({message: error.message});

    const genre: HydratedDocument<IGenre> = new GenreModel({
        name: req.body.name
    });

    try {
        const result: IGenre = await genre.save();
        return res.json({new_genre: result});
    } catch (ex) {
        return res.status(500).json(ex);
    }

}));

router.put('/:id', async (req: Request, res: Response) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({message: "The provided ID is invalid!"});
    }

    const {error}: { error: ValidationError | undefined } = genreValidator(req.body);
    if (error) return res.status(400).json({message: error.message});

    try {
        const genre: IGenre | null = await GenreModel.findByIdAndUpdate(req.params.id, {
            name: req.body.name
        });

        if (!genre) return res.status(404).json({message: `No resource found with id(${req.params.id}).`});

        return res.json({updated_genre: genre});

    } catch (ex) {
        return res.status(500).json(ex);
    }

});

router.delete('/:id', [auth, admin], async (req: Request, res: Response) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({message: "The provided ID is invalid!"});
    }

    try {
        const genre: IGenre | null = await GenreModel.findByIdAndDelete(req.params.id);

        if (!genre) return res.status(404).json({message: `No resource found with id(${req.params.id}).`});

        return res.json({deleted: genre});
    } catch (ex) {
        return res.status(500).json(ex);
    }
});

export default router;