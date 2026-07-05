import { Request, Response, NextFunction } from 'express';

const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`) as any;
  error.statusCode = 404;
  error.status = 'fail';
  error.isOperational = true;
  next(error);
};

export default notFound;
