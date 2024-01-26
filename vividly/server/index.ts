import express, {Express} from 'express';
import error from "./middleware/error";
import routes from "./startup/routes";
import db from "./startup/db";
import logging from "./startup/logging";
import config from "./startup/config"
import logger from "./logger/logger";

const app: Express = express();

logging();
routes(app);
db();
config();

app.use(error);

const port: number = +(process.env.PORT?.toString() || '5000');
app.listen(port, () => logger.info(`Running on port ${port}`));