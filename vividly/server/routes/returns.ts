import {Router, Request, Response} from "express";
import asyncWrapper from "../middleware/asyncWrapper";
import auth from "../middleware/auth";
import Joi, {ValidationError, ValidationResult} from "joi";
import mongoose, {ClientSession, HydratedDocument} from "mongoose";
import {RentalModel} from "../models/rental";
import {models} from "../types";
import IRental = models.IRental;
import moment from "moment";
import {MovieModel} from "../models/movie";
import validateRequestBody from "../middleware/validateRequestBody";

const validateReturn = (returnObj: {}): ValidationResult => {
    const schema = Joi.object({
        customerId: Joi.string().required(),
        movieId: Joi.string().required()
    });

    return schema.validate(returnObj);
};

const router: Router = Router();

router.post('/', [auth, validateRequestBody(validateReturn)], asyncWrapper(async (req: Request, res: Response) => {
    if (!mongoose.isValidObjectId(req.body.customerId)) {
        return res.status(400).json({message: "The provided customerId is invalid!"});
    }

    if (!mongoose.isValidObjectId(req.body.movieId)) {
        return res.status(400).json({message: "The provided movieId is invalid!"});
    }

    const rental: HydratedDocument<IRental> | null = await RentalModel.findOne({
        'movie._id': req.body.movieId,
        'customer._id': req.body.customerId
    });

    if (!rental) return res.status(404).json('Rental not found');
    if (rental.dateReturned) return res.status(400).json('This rental has already been processed');

    rental.dateReturned = new Date();

    const rentalDays: number = moment().diff(rental.dateOut, 'days');
    rental.rentalFee = rental.movie.dailyRentalRate * rentalDays;

    await rental.save();


    const session: ClientSession = await mongoose.startSession();

    try {
        await session.withTransaction(async () => {
            await rental.save();
            await MovieModel.findByIdAndUpdate(rental.movie._id, {
                $inc: {numberInStock: 1}
            });
        });

        await session.commitTransaction();
    } catch (ex) {
        await session.abortTransaction();
        throw new Error();
    } finally {
        await session.endSession();
    }

    return res.json(rental);
}));

export default router;