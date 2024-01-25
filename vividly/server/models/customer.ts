import mongoose from "mongoose";
import Joi from "joi";
import {models} from "../types";
import ICustomer = models.ICustomer;

export const customerSchema: mongoose.Schema<ICustomer> = new mongoose.Schema<ICustomer>({
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
        required: true,
        min: 5,
        max: 50
    }
});

export const CustomerModel: mongoose.Model<ICustomer> = mongoose.model<ICustomer>('Customer', customerSchema);

export const customerCreateValidator = (customer: ICustomer) => {
    const schema = Joi.object({
        isGold: Boolean,
        name: Joi.string().min(1).max(100).required(),
        phone: Joi.string().min(5).max(50).required(),
    });

    return schema.validate(customer);
};

export const customerUpdateValidator = (customer: ICustomer) => {
    const schema = Joi.object({
        isGold: Joi.boolean(),
        name: Joi.string().min(1).max(100),
        phone: Joi.string().min(5).max(50)
    });

    return schema.validate(customer);
};