import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

// Extend Request interface to include user
export interface AuthRequest extends Request {
  user?: IUser;
}

// Generate JWT token
export const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not defined');
  
  return jwt.sign({ id: userId }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  } as any);
};

// Generate refresh token
export const generateRefreshToken = (userId: string): string => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) throw new Error('JWT_REFRESH_SECRET is not defined');
  
  return jwt.sign({ id: userId }, secret, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  } as any);
};

// Verify JWT token
export const verifyToken = (token: string): any => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not defined');
  
  return jwt.verify(token, secret);
};

// Verify refresh token
export const verifyRefreshToken = (token: string): any => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) throw new Error('JWT_REFRESH_SECRET is not defined');
  
  return jwt.verify(token, secret);
};

// Middleware to protect routes
export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;

    // Check if token exists in header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      const error = new Error('You are not logged in! Please log in to get access.') as any;
      error.statusCode = 401;
      error.status = 'fail';
      error.isOperational = true;
      return next(error);
    }

    // Verify token
    const decoded = verifyToken(token);

    // Check if user still exists
    const currentUser = await User.findById(decoded.id).select('+password');
    if (!currentUser) {
      const error = new Error('The user belonging to this token does no longer exist.') as any;
      error.statusCode = 401;
      error.status = 'fail';
      error.isOperational = true;
      return next(error);
    }

    // Check if user is active
    if (!currentUser.isActive) {
      const error = new Error('Your account has been deactivated. Please contact support.') as any;
      error.statusCode = 401;
      error.status = 'fail';
      error.isOperational = true;
      return next(error);
    }

    // Grant access to protected route
    req.user = currentUser;
    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      error.statusCode = 401;
      error.status = 'fail';
      error.message = 'Invalid token. Please log in again!';
      error.isOperational = true;
    } else if (error.name === 'TokenExpiredError') {
      error.statusCode = 401;
      error.status = 'fail';
      error.message = 'Your token has expired! Please log in again.';
      error.isOperational = true;
    }
    next(error);
  }
};

// Middleware to restrict access to certain roles
export const restrictTo = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      const error = new Error('You do not have permission to perform this action') as any;
      error.statusCode = 403;
      error.status = 'fail';
      error.isOperational = true;
      return next(error);
    }
    next();
  };
};

// Optional authentication middleware (doesn't throw error if no token)
export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;

    // Check if token exists in header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      // Verify token
      const decoded = verifyToken(token);

      // Check if user still exists and is active
      const currentUser = await User.findById(decoded.id);
      if (currentUser && currentUser.isActive) {
        req.user = currentUser;
      }
    }

    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
};

// Middleware to ensure user owns the resource or is admin
export const checkOwnership = (resourceField: string = 'user') => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      const error = new Error('Authentication required') as any;
      error.statusCode = 401;
      error.status = 'fail';
      error.isOperational = true;
      return next(error);
    }

    // Admin can access any resource
    if (req.user.role === 'admin') {
      return next();
    }

    // Check if user owns the resource
    const resourceId = req.params.id;
    if (!resourceId) {
      const error = new Error('Resource ID is required') as any;
      error.statusCode = 400;
      error.status = 'fail';
      error.isOperational = true;
      return next(error);
    }

    // This would need to be customized based on your specific models
    // For now, we'll just check if the user ID matches
    if (req.user._id.toString() !== resourceId) {
      const error = new Error('You can only access your own resources') as any;
      error.statusCode = 403;
      error.status = 'fail';
      error.isOperational = true;
      return next(error);
    }

    next();
  };
};
