import Joi from 'joi';
import {Customer, Genre} from "../interfaces";

export const genreValidator = (genre: Genre) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        tags: Joi.array()
    });

    return schema.validate(genre);
};

export const customerCreateValidator = (customer: Customer) => {
    const schema = Joi.object({
        isGold: Boolean,
        name: Joi.string().min(1).max(100).required(),
        phone: Joi.string().min(5).max(50).required(),
    });

    return schema.validate(customer);
};

export const customerUpdateValidator = (customer: Customer) => {
    const schema = Joi.object({
        isGold: Joi.boolean(),
        name: Joi.string().min(1).max(100),
        phone: Joi.string().min(5).max(50)
    });

    return schema.validate(customer);

};