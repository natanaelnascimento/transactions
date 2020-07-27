import winston from 'winston';
import winstondb from 'winston-mongodb';
import dotenv from 'dotenv';

dotenv.config();

const { label } = winston.format;
const { createLogger, transports, format } = winston;

const myFormat = format.printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = createLogger({
  transports: [
    new transports.Console(),
    new transports.MongoDB({
      level: 'info',
      db: process.env.DB_CONNECTION,
      collection: 'logs',
      capped: true,
      cappedMax: 50,
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    }),
  ],
  format: format.combine(
    label({ label: 'transactions-api' }),
    format.timestamp(),
    myFormat
  ),
});

export default logger;
