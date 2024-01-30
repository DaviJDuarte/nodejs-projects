import mongoose, {Model, Schema} from "mongoose";
import Joi from "joi";
import {models} from "../types";
import IRental = models.IRental;
import moment from "moment/moment";

export const rentalSchema: Schema<IRental> = new mongoose.Schema<IRental>({
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

rentalSchema.methods.return = async function () {
    this.dateReturned = new Date();

    const rentalDays: number = moment().diff(this.dateOut, 'days');
    this.rentalFee = this.movie.dailyRentalRate * rentalDays;
    await this.save();
};

export const RentalModel: Model<IRental> = mongoose.model<IRental>('Rental', rentalSchema);

export const rentalValidator = (rental: IRental) => {
    const schema = Joi.object({
        customerId: Joi.string().required(),
        movieId: Joi.string().required()
    });

    return schema.validate(rental);
};