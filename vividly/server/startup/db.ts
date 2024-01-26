import mongoose from "mongoose";
import logger from "../logger/logger";

export default function (): void {
    mongoose.connect("mongodb://localhost/vividly")
        .then(() => logger.info("Connected to MongoDB"));
}

