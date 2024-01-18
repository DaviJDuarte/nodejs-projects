import {Request, Response, Router} from "express";
import {Movie, MovieModel, movieCreateValidator, movieSchema, movieUpdateValidator} from "../models/movie";
import {GenreModel, Genre} from "../models/genre";
import mongoose, {HydratedDocument} from "mongoose";
import {ValidationError} from "joi";

const router: Router = Router();

router.get('/', async (_req: Request, res: Response) => {
    try {
        const movies: Movie[] | null = await MovieModel.find();
        return res.json(movies);
    } catch (error) {
        return res.status(500).json(error);
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({message: "The provided ID is invalid!"});
    }

    try {
        const movie: Movie | null = await MovieModel.findById(req.params.id);

        if (!movie) return res.status(404).json({message: `No resource found with ID(${req.params.id}).`});

        return res.json(movie);
    } catch (ex) {
        return res.status(500).json(ex);
    }
});

router.post('/', async (req: Request, res: Response) => {
    const {error}: { error: ValidationError | undefined } = movieCreateValidator(req.body);
    if (error) return res.status(400).json({message: error.message});

    if (!mongoose.isValidObjectId(req.body.genreId)) {
        return res.status(400).json({message: "The provided genreId is invalid!"});
    }

    try {
        const genre: Genre | null = await GenreModel.findById(req.body.genreId);

        if (!genre) return res.status(404).json({message: "Genre not found"});

        const movie: HydratedDocument<Movie> = new MovieModel({
            title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        });

        const result: Movie = await movie.save();
        return res.json(result);

    } catch (ex) {
        return res.status(500).json(ex);
    }
});

router.put('/:id', async (req: Request, res: Response) => {
    const {error}: { error: ValidationError | undefined } = movieUpdateValidator(req.body);
    if (error) return res.status(400).json({message: error.message});

    const {id} = req.params;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({message: "The provided movie ID is invalid!"});
    }

    try {
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
            const genre: Genre | null = await GenreModel.findById(genreId);

            if (!genre) {
                return res.status(400).json({message: 'Genre not found'});
            }

            delete filteredUpdates.$set.genreId;
            filteredUpdates.$set.genre = {};
            filteredUpdates.$set.genre._id = genreId;
            filteredUpdates.$set.genre.name = genre.name;
        }

        // Update the document
        const result: Movie | null = await MovieModel.findByIdAndUpdate(id, filteredUpdates, {
            new: true
        });

        if (!result) {
            return res.status(404).json({message: `No movie with ID(${id})`});
        }

        res.json(result);
    } catch (ex) {
        console.error(ex);
        res.status(500).json(ex);
    }
});

router.delete('/:id', async (req: Request, res: Response) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({message: "The provided ID is invalid!"});
    }

    try {
        const result: Movie | null = await MovieModel.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({message: `No resource found with ID(${req.params.id}).`});
        return res.json({deleted: result});
    } catch (ex) {
        return res.status(500).json(ex);
    }
});

export default router;