import winston from 'winston';
import path from 'path';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Tell winston that you want to link the colors
winston.addColors(colors);

// Define which level to log based on environment
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

// Define log formats
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  ),
);

// Define which transports to use
const transports = [
  new winston.transports.Console(),
  // Log errors to a file
  new winston.transports.File({
    filename: path.join(process.env.LOG_DIR || 'logs', 'error.log'),
    level: 'error',
  }),
  // Log all levels to a combined file
  new winston.transports.File({
    filename: path.join(process.env.LOG_DIR || 'logs', 'combined.log'),
  }),
];

// Create the logger
const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
  // Do not exit on handled exceptions
  exitOnError: false,
});

// Create logs directory if it doesn't exist
import fs from 'fs';
const logDir = process.env.LOG_DIR || 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

export default logger;
