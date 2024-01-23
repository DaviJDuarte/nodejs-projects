import {Router, Request, Response} from "express";
import {RentalModel, rentalValidator} from "../models/rental";
import {ValidationError} from "joi";
import mongoose, {HydratedDocument, isValidObjectId, ClientSession} from "mongoose";
import {MovieModel} from "../models/movie";
import {CustomerModel} from "../models/customer";
import {models} from "../types";
import IRental = models.IRental;
import IMovie = models.IMovie;
import ICustomer = models.ICustomer;

const router: Router = Router();

router.get('/', async (_req: Request, res: Response) => {
    const rentals: IRental[] = await RentalModel.find();
    return res.json(rentals);
});

router.get('/:id', async (req: Request, res: Response) => {
    const id: string = req.params.id;

    if (!isValidObjectId(id))
        return res.status(400).json({message: `The provided rentalId(${id}) is invalid!`});

    const rental: IRental | null = await RentalModel.findById(id);
    if (!rental)
        return res.status(404).json({message: `No rental found with ID(${id})`});

    return res.json(rental);
});

router.post('/', async (req: Request, res: Response) => {
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
        customer: {
            _id: customer._id,
            isGold: customer.isGold,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });

    const session: ClientSession = await mongoose.startSession();
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
        return res.status(500).json({message: "Something went wrong"});
    } finally {
        await session.endSession();
    }
});
export default router;