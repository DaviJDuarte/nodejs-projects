import {Request, Response, Router} from "express";
import {MovieModel, movieCreateValidator, movieSchema, movieUpdateValidator} from "../models/movie";
import {GenreModel} from "../models/genre";
import mongoose, {HydratedDocument} from "mongoose";
import {models} from "../types";
import IMovie = models.IMovie;
import IGenre = models.IGenre;
import asyncWrapper from "../middleware/asyncWrapper";
import validateObjectId from "../middleware/validateObjectId";
import validateRequestBody from "../middleware/validateRequestBody";
import auth from "../middleware/auth";
import admin from "../middleware/admin";

const router: Router = Router();

router.get('/', asyncWrapper(async (_req: Request, res: Response) => {
    const movies: IMovie[] | null = await MovieModel.find();
    return res.json(movies);
}));

router.get('/:id', asyncWrapper(async (req: Request, res: Response) => {
    const movie: IMovie | null = await MovieModel.findById(req.params.id);

    if (!movie) return res.status(404).json({message: `No resource found with ID(${req.params.id}).`});

    return res.json(movie);
}));

router.post('/', [auth, validateRequestBody(movieCreateValidator)], asyncWrapper(async (req: Request, res: Response) => {
    if (!mongoose.isValidObjectId(req.body.genreId)) {
        return res.status(400).json({message: "The provided genreId is invalid!"});
    }

    const genre: IGenre | null = await GenreModel.findById(req.body.genreId);

    if (!genre) return res.status(404).json({message: "Genre not found"});

    const movie: HydratedDocument<IMovie> = new MovieModel({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });

    const result: IMovie = await movie.save();
    return res.json(result);

}));

router.put('/:id', [auth, validateRequestBody(movieUpdateValidator), validateObjectId], asyncWrapper(async (req: Request, res: Response) => {
    const {id} = req.params;
    const updates = req.body;

    // Filter updates to include only defined fields in the schema
    const filteredUpdates = Object.keys(updates).reduce((acc: Record<string, any>, field: string) => {
        acc.$set = acc.$set || {};
        if (movieSchema.paths[field]) {
            acc.$set[field] = updates[field];
        }
        return acc;
    }, {});

    const {genreId = null} = updates;

    if (genreId) {
        const genre: IGenre | null = await GenreModel.findById(genreId);

        if (!genre) {
            return res.status(400).json({message: 'Genre not found'});
        }

        delete filteredUpdates.$set.genreId;
        filteredUpdates.$set.genre = {};
        filteredUpdates.$set.genre._id = genreId;
        filteredUpdates.$set.genre.name = genre.name;
    }

    // Update the document
    const result: IMovie | null = await MovieModel.findByIdAndUpdate(id, filteredUpdates, {
        new: true
    });

    if (!result) {
        return res.status(404).json({message: `No movie with ID(${id})`});
    }

    res.json(result);
}));

router.delete('/:id', [auth, admin, validateObjectId], asyncWrapper(async (req: Request, res: Response) => {
    const result: IMovie | null = await MovieModel.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({message: `No resource found with ID(${req.params.id}).`});
    return res.json({deleted: result});
}));

export default router;