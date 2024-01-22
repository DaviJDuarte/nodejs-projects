import express, {Express} from 'express';
import mongoose from "mongoose";
import genres from './routes/genres';
import customers from "./routes/customers";
import movies from "./routes/movies";
import rentals from "./routes/rentals";

const app: Express = express();
app.use(express.json());

mongoose.connect("mongodb://localhost/vividly")
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.log(error));

app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);

const port: number = +(process.env.PORT?.toString() || '5000');
app.listen(port, () => console.log(`Running on port ${port}`));