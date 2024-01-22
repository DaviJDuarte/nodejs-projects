import mongoose, {ObjectId} from "mongoose";
import Joi from "joi";
import {genreSchema} from "./genre";
import {Genre} from "./genre";

export interface Movie {
    _id?: ObjectId,
    title: string,
    genre: Genre,
    numberInStock: number,
    dailyRentalRate: number
}

export const movieSchema: mongoose.Schema<Movie> = new mongoose.Schema<Movie>({
    title: {
        type: String,
        min: 2,
        max: 255,
        trim: true,
        required: true
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        min: 0,
        max: 255,
        required: true
    },
    dailyRentalRate: {
        type: Number,
        min: 0,
        max: 255,
        required: true
    }
});

export const MovieModel: mongoose.Model<Movie> = mongoose.model<Movie>('Movie', movieSchema);

export const movieCreateValidator = (movie: Movie) => {
    const schema = Joi.object({
        title: Joi.string().min(2).max(255).required(),
        genreId: Joi.string().required(),
        numberInStock: Joi.number().min(0).max(255).required(),
        dailyRentalRate: Joi.number().min(0).max(255).required()
    });

    return schema.validate(movie);
};

export const movieUpdateValidator = (movie: Movie) => {
    const schema = Joi.object({
        title: Joi.string().min(2).max(255),
        genreId: Joi.string(),
        numberInStock: Joi.number().min(0).max(255),
        dailyRentalRate: Joi.number().min(0).max(255)
    });

    return schema.validate(movie);
};