import {Request, Response, Router} from "express";
import {Genre, GenreModel, genreValidator} from "../models/genre";
import mongoose, {HydratedDocument} from "mongoose";
import {ValidationError} from "joi";

const router: Router = Router();

router.get('/', async (_req: Request, res: Response) => {
    try {
        const genres: Genre[] = await GenreModel.find();
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
        const genre: Genre | null = await GenreModel.findById(req.params.id);

        if (!genre) return res.status(404).json({message: `No resource found with id(${req.params.id}).`});

        return res.json(genre);
    } catch (ex) {
        return res.status(500).json(ex);
    }
});


router.post('/', async (req: Request, res: Response) => {
    const {error}: { error: ValidationError | undefined } = genreValidator(req.body);

    if (error) return res.status(400).json({message: error.message});

    const genre: HydratedDocument<Genre> = new GenreModel({
        name: req.body.name
    });

    try {
        const result: Genre = await genre.save();
        return res.json({new_genre: result});
    } catch (ex) {
        return res.status(500).json(ex);
    }

});

router.put('/:id', async (req: Request, res: Response) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({message: "The provided ID is invalid!"});
    }

    const {error}: { error: ValidationError | undefined } = genreValidator(req.body);
    if (error) return res.status(400).json({message: error.message});

    try {
        const genre: Genre | null = await GenreModel.findByIdAndUpdate(req.params.id, {
            name: req.body.name
        });

        if (!genre) return res.status(404).json({message: `No resource found with id(${req.params.id}).`});

        return res.json({updated_genre: genre});

    } catch (ex) {
        return res.status(500).json(ex);
    }

});

router.delete('/:id', async (req: Request, res: Response) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({message: "The provided ID is invalid!"});
    }

    try {
        const genre: Genre | null = await GenreModel.findByIdAndDelete(req.params.id);

        if (!genre) return res.status(404).json({message: `No resource found with id(${req.params.id}).`});

        return res.json({deleted: genre});
    } catch (ex) {
        return res.status(500).json(ex);
    }
});

export default router;