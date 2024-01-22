import mongoose, {ObjectId} from "mongoose";
import Joi from "joi";

export interface Customer {
    [key: string]: any

    _id?: ObjectId,
    isGold: boolean,
    name: string,
    phone: string
}

export const customerSchema: mongoose.Schema<Customer> = new mongoose.Schema<Customer>({
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

export const CustomerModel: mongoose.Model<Customer> = mongoose.model<Customer>('Customer', customerSchema);

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