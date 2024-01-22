import mongoose, {Model, ObjectId, Schema} from "mongoose";
import Joi from "joi";
import {Customer} from "./customer";
import {Movie} from "./movie";

export interface Rental {
    _id?: ObjectId,
    customer: Customer,
    movie: Movie,
    dateOut?: Date,
    dateReturned?: Date
    rentalFee?: number
}

export const rentalSchema: Schema<Rental> = new mongoose.Schema<Rental>({
    customer: {
        type: new Schema({
            _id: {
                type: String,
                required: true,
            },
            name: {
                type: String,
                required: true,
                min: 1,
                max: 100
            },
            isGold: {
                type: Boolean,
                default: false
            },
            phone: {
                type: String,
                required: true,
                min: 5,
                max: 50
            }
        }),
        required: true
    },
    movie: {
        type: new Schema({
            _id: {
                type: String,
                required: true
            },
            title: {
                type: String,
                min: 2,
                max: 255,
                trim: true,
                required: true
            },
            dailyRentalRate: {
                type: Number,
                min: 0,
                max: 255,
                required: true
            }
        }),
        required: true
    },
    dateOut: {
        type: Date,
        default: Date.now,
        required: true
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }
});

export const RentalModel: Model<Rental> = mongoose.model('Rental', rentalSchema);

export const rentalValidator = (rental: Rental) => {
    const schema = Joi.object({
        customerId: Joi.string().required(),
        movieId: Joi.string().required()
    });

    return schema.validate(rental);
};