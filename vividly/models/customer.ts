import mongoose from "mongoose";
import {Customer} from "../interfaces";
import Joi from "joi";

const customerSchema = new mongoose.Schema({
    isGold: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        required: true,
        min: 1,
        max: 100
    },
    phone: {
        type: String,
        required: true
    }
});

export const CustomerModel = mongoose.model('Customer', customerSchema);

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