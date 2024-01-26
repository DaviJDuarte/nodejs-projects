import winston, {format} from "winston";
import {MongoDB} from "winston-mongodb";

const logger: winston.Logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: {service: 'user-service'},
    transports: [
        new winston.transports.Console({
            format: format.combine(
                format.colorize(),
                format.simple()
            )
        }),
        new winston.transports.File({filename: 'error.log', level: 'error'}),
        new winston.transports.File({filename: 'combined.log', level: 'warn'}),
        new MongoDB({
            db: "mongodb://localhost/vividly",
            options: {useNewUrlParser: true, useUnifiedTopology: true},
            level: "error"
        }),
    ],
});

export default logger;