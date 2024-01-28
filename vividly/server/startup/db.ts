import mongoose from "mongoose";
import logger from "../logger/logger";
import config from "config";

export default function (): void {
    const db: string = config.get('db');
    mongoose.connect(db)
        .then(() => logger.info(`Connected to ${db}`));
}

