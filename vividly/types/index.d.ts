import {ObjectId} from "mongoose";
import {Customer} from "../models/customer";
import {Movie} from "../models/movie";
import {Genre} from "../models/genre";

namespace models {
    interface IUser {
        _id?: ObjectId,
        name: string,
        email: string,
        password: string
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
    }
}
