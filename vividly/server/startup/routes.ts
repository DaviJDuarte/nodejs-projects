import express, {Express} from "express";
import * as routes from '../routes'
import error from "../middleware/error";

export default function (app: Express): void {
    app.use(express.json());
    app.use('/api/genres', routes.genres);
    app.use('/api/customers', routes.customers);
    app.use('/api/movies', routes.movies);
    app.use('/api/rentals', routes.rentals);
    app.use('/api/users', routes.users);
    app.use('/api/auth', routes.auth);
    app.use('/api/returns', routes.returns);
    app.use(error);
}
