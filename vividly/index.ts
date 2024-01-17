import express from 'express';
import mongoose from "mongoose";
import genres from './routes/genres';
import customers from "./routes/customers";

const app = express();
app.use(express.json());

app.use((_req, res, next: Function) => {
    res.contentType('application/json');
    next();
});

mongoose.connect("mongodb://localhost/vividly")
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.log(error));

app.use('/api/genres', genres);
app.use('/api/customers', customers);

const port: number = +(process.env.PORT?.toString() || '5000');
app.listen(port, () => console.log(`Running on port ${port}`));