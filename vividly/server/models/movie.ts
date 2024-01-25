import mongoose from "mongoose";
import Joi from "joi";
import {genreSchema} from "./genre";
import {models} from "../types";
import IMovie = models.IMovie;

export const movieSchema: mongoose.Schema<IMovie> = new mongoose.Schema<IMovie>({
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

export const MovieModel: mongoose.Model<IMovie> = mongoose.model<IMovie>('Movie', movieSchema);

export const movieCreateValidator = (movie: IMovie) => {
    const schema = Joi.object({
        title: Joi.string().min(2).max(255).required(),
        genreId: Joi.string().required(),
        numberInStock: Joi.number().min(0).max(255).required(),
        dailyRentalRate: Joi.number().min(0).max(255).required()
    });

    return schema.validate(movie);
};

export const movieUpdateValidator = (movie: IMovie) => {
    const schema = Joi.object({
        title: Joi.string().min(2).max(255),
        genreId: Joi.string(),
        numberInStock: Joi.number().min(0).max(255),
        dailyRentalRate: Joi.number().min(0).max(255)
    });

    return schema.validate(movie);
};