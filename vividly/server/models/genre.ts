import Joi from "joi";
import mongoose from "mongoose";
import {models} from "../types";
import IGenre = models.IGenre;

export const genreSchema: mongoose.Schema<IGenre> = new mongoose.Schema<IGenre>({
    name: {
        type: String,
        required: true,
        min: 3,
        max: 50
    }
});

export const GenreModel: mongoose.Model<IGenre> = mongoose.model<IGenre>('Genre', genreSchema);

export const genreValidator = (genre: IGenre) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required()
    });

    return schema.validate(genre);
};
