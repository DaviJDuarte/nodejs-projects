import express, {Express} from 'express';
import * as startup from "./startup";
import logger from "./logger/logger";

const app: Express = express();

startup.logging();
startup.routes(app);
startup.db();
startup.config();

const port: number = +(process.env.PORT?.toString() || '5000');
const server = app.listen(port, () => logger.info(`Running on port ${port}`));

export default server;