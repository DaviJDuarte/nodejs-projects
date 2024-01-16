import Joi from 'joi';
import {Genre} from "../interfaces";

const genreValidator = (genre: Genre) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        tags: Joi.array()
    });

    return schema.validate(genre);
};

export default genreValidator;