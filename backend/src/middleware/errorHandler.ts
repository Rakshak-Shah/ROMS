import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

interface CustomError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
}

const handleCastErrorDB = (err: any): CustomError => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  const error = new Error(message) as CustomError;
  error.statusCode = 400;
  error.isOperational = true;
  return error;
};

const handleDuplicateFieldsDB = (err: any): CustomError => {
  const value = err.errmsg?.match(/(["'])(\\?.)*?\1/)?.[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  const error = new Error(message) as CustomError;
  error.statusCode = 400;
  error.isOperational = true;
  return error;
};

const handleValidationErrorDB = (err: any): CustomError => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  const error = new Error(message) as CustomError;
  error.statusCode = 400;
  error.isOperational = true;
  return error;
};

const handleJWTError = (): CustomError => {
  const error = new Error('Invalid token. Please log in again!') as CustomError;
  error.statusCode = 401;
  error.isOperational = true;
  return error;
};

const handleJWTExpiredError = (): CustomError => {
  const error = new Error('Your token has expired! Please log in again.') as CustomError;
  error.statusCode = 401;
  error.isOperational = true;
  return error;
};

const sendErrorDev = (err: CustomError, req: Request, res: Response) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode || 500).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // RENDERED WEBSITE
  logger.error('ERROR 💥', err);
  return res.status(err.statusCode || 500).json({
    title: 'Something went wrong!',
    msg: err.message,
  });
};

const sendErrorProd = (err: CustomError, req: Request, res: Response) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode || 500).json({
        status: err.status,
        message: err.message,
      });
    }
    // B) Programming or other unknown error: don't leak error details
    // 1) Log error
    logger.error('ERROR 💥', err);
    // 2) Send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }

  // B) RENDERED WEBSITE
  // A) Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode || 500).json({
      title: 'Something went wrong!',
      msg: err.message,
    });
  }
  // B) Programming or other unknown error: don't leak error details
  // 1) Log error
  logger.error('ERROR 💥', err);
  // 2) Send generic message
  return res.status(err.statusCode || 500).json({
    title: 'Something went wrong!',
    msg: 'Please try again later.',
  });
};

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};

export default errorHandler;
