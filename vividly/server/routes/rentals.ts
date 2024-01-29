import {Router, Request, Response} from "express";
import _ from 'lodash';
import {RentalModel, rentalValidator} from "../models/rental";
import {ValidationError} from "joi";
import mongoose, {HydratedDocument, isValidObjectId, ClientSession} from "mongoose";
import {MovieModel} from "../models/movie";
import {CustomerModel} from "../models/customer";
import {models} from "../types";
import IRental = models.IRental;
import IMovie = models.IMovie;
import ICustomer = models.ICustomer;
import asyncWrapper from "../middleware/asyncWrapper";
import validateObjectId from "../middleware/validateObjectId";

const router: Router = Router();

router.get('/', asyncWrapper(async (_req: Request, res: Response) => {
    const rentals: IRental[] = await RentalModel.find();
    return res.json(rentals);
}));

router.get('/:id', validateObjectId, asyncWrapper(async (req: Request, res: Response) => {
    const id: string = req.params.id;

    const rental: IRental | null = await RentalModel.findById(id);
    if (!rental)
        return res.status(404).json({message: `No rental found with ID(${id})`});

    return res.json(rental);
}));

router.post('/', asyncWrapper(async (req: Request, res: Response) => {
    const {error}: { error: ValidationError | undefined } = rentalValidator(req.body);
    if (error) return res.status(400).json({message: error.message});

    const customerId = req.body.customerId;
    const movieId = req.body.movieId;

    if (!isValidObjectId(customerId))
        return res.status(400).json({message: `The provided customerId(${customerId}) is invalid!`});
    if (!isValidObjectId(movieId))
        return res.status(400).json({message: `The provided movieId(${movieId}) is invalid!`});

    const movie: HydratedDocument<IMovie> | null = await MovieModel.findById(movieId);
    if (!movie)
        return res.status(404).json({message: `No movie found with ID(${movieId})`});

    const customer: HydratedDocument<ICustomer> | null = await CustomerModel.findById(customerId);
    if (!customer)
        return res.status(404).json({message: `No customer found with ID(${customerId})`});

    if (movie.numberInStock <= 0)
        return res.status(400).json({message: `The requested movie ("${movie.title}") is not currently in stock.`});

    let rental: HydratedDocument<IRental> = new RentalModel({
        customer: _.pick(customer, ['_id', 'isGold', 'name', 'phone']),
        movie: _.pick(movie, ['_id', 'title', 'dailyRentalRate'])
    });

    const session: ClientSession = await mongoose.startSession();

    // Keeping this try catch even though there is a global error handler.
    // This process with sessions requires custom error handling.
    try {
        await session.withTransaction(async () => {
            await rental.save();
            movie.numberInStock--;
            await movie.save();
        });

        await session.commitTransaction();
        return res.json(rental);
    } catch (ex) {
        await session.abortTransaction();
        throw new Error();
    } finally {
        await session.endSession();
    }
}));

export default router;