import express from 'express';
import genres from './routes/genres';

const app = express();
app.use(express.json());

app.use((_req, res, next: Function) => {
    res.contentType('application/json');
    next();
});

app.use('/api/genres', genres);

const port: number = +(process.env.PORT?.toString() || '5000');
app.listen(port, () => console.log(`Running on port ${port}`));