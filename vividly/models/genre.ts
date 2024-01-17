import Joi from "joi";
import {Genre} from "../interfaces";
import mongoose from "mongoose";

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 3,
        max: 50
    },
    tags: [String]
});

export const GenreModel = mongoose.model('Genre', genreSchema);

export const genreValidator = (genre: Genre) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        tags: Joi.array()
    });

    return schema.validate(genre);
};
