import logger from "../logger/logger";

export default function (): void {
    process.on('uncaughtException', (ex: Error) => {
        logger.error(ex.message, ex);
        process.exit();
    });

    process.on('unhandledRejection', (ex: Error) => {
        logger.error(ex.message, ex);
        process.exit();
    });
}

