import {ObjectId} from "mongoose";
import {Request} from "express";

namespace global {
    interface AuthRequest extends Request {
        user?: DataStoredInToken
    }

    interface DataStoredInToken {
        _id: string,
        isAdmin: boolean
    }
}

namespace models {
    interface IUser {
        _id?: ObjectId,
        name: string,
        email: string,
        password: string,
        isAdmin?: boolean

        generateAuthToken(): string
    }

    interface IGenre {
        _id?: ObjectId,
        name: string,
    }

    interface IMovie {
        _id?: ObjectId,
        title: string,
        genre: Genre,
        numberInStock: number,
        dailyRentalRate: number
    }

    interface ICustomer {
        _id?: ObjectId,
        isGold: boolean,
        name: string,
        phone: string
    }

    interface IRental {
        _id?: ObjectId,
        customer: Customer,
        movie: Movie,
        dateOut?: Date,
        dateReturned?: Date
        rentalFee?: number

        return(): void
    }
}
