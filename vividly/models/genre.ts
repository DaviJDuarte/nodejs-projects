import Joi from "joi";
import mongoose, {ObjectId} from "mongoose";

export interface Genre {
    _id?: ObjectId,
    name: string,
}

export const genreSchema: mongoose.Schema<Genre> = new mongoose.Schema<Genre>({
    name: {
        type: String,
        required: true,
        min: 3,
        max: 50
    }
});

export const GenreModel: mongoose.Model<Genre> = mongoose.model<Genre>('Genre', genreSchema);

export const genreValidator = (genre: Genre) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    return schema.validate(genre);
};
