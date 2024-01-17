import express from "express";
import genreValidator from "../validators/genre-validator";
import mongoose from "mongoose";

const genreSchema = new mongoose.Schema({
    name: {type: String, required: true, min: 3, max: 50},
    tags: [String]
});

const Genre = mongoose.model('Genre', genreSchema);

const router = express.Router();

router.get('/', async (_req, res) => {
    const genres = await Genre.find();
    return res.send(JSON.stringify({genres}));
});

router.get('/:id', async (req, res) => {
    try {
        const genres = await Genre.find({_id: req.params.id});
        return res.send(JSON.stringify(genres));
    } catch (ex: any) {
        if (ex.name === 'CastError' && ex.path === '_id') {
            return res.status(400).send(JSON.stringify({message: "The provided ID is invalid"}));
        }

        return res.status(500).send(JSON.stringify(ex));
    }
});

router.post('/', async (req, res) => {
    const {error} = genreValidator(req.body);

    if (error) return res.status(400).send(JSON.stringify({message: error.message}));

    const genre = new Genre({
        name: req.body.name,
        tags: req.body.tags || []
    });

    try {
        const result = await genre.save();
        return res.send(JSON.stringify({new_genre: result}));
    } catch (ex) {
        return res.status(500).send(JSON.stringify(ex));
    }

});

router.put('/:id', async (req, res) => {
    try {
        const genre = await Genre.findById(req.params.id);

        if (!genre) return res.status(404).send(JSON.stringify({message: `No resource found with id(${req.params.id}).`}));

        const {error} = genreValidator(req.body);
        if (error) return res.status(400).send(JSON.stringify({message: error.message}));

        genre.set({
            name: req.body.name,
            tags: req.body.tags || []
        });


        const result = await genre.save();
        return res.send(JSON.stringify({updated_genre: result}));

    } catch (ex: any) {
        if (ex.name === 'CastError' && ex.path === '_id') {
            return res.status(400).send(JSON.stringify({message: "The provided ID is invalid"}));
        }

        return res.status(500).send(JSON.stringify(ex));
    }

});

router.delete('/:id', async (req, res) => {
    try {
        const genre = await Genre.findByIdAndDelete(req.params.id);

        if (!genre) return res.status(404).send(JSON.stringify({message: `No resource found with id(${req.params.id}).`}));

        return res.send(JSON.stringify({deleted: genre}));
    } catch (ex: any) {
        if (ex.name === 'CastError' && ex.path === '_id') {
            return res.status(400).send(JSON.stringify({message: "The provided ID is invalid"}));
        }

        return res.status(500).send(JSON.stringify(ex));
    }
});

export default router;