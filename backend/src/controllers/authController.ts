import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { AuthRequest, generateToken, generateRefreshToken } from '../middleware/auth';
import User from '../models/User';
import logger from '../utils/logger';

// Register new user
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, phone, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error('User already exists with this email') as any;
      error.statusCode = 400;
      error.status = 'fail';
      error.isOperational = true;
      return next(error);
    }

    // Create new user
    const user = new User({
      name,
      email,
      phone,
      password,
      role: 'customer',
      isActive: true,
      verificationToken: crypto.randomBytes(32).toString('hex')
    });

    await user.save();
    
    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    logger.info(`New user registered: ${email}`);

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// Login user
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // Check if user exists and password is correct
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
      const error = new Error('Invalid email or password') as any;
      error.statusCode = 401;
      error.status = 'fail';
      error.isOperational = true;
      return next(error);
    }

    if (!user.isActive) {
      const error = new Error('Your account has been deactivated') as any;
      error.statusCode = 401;
      error.status = 'fail';
      error.isOperational = true;
      return next(error);
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    logger.info(`User logged in: ${email}`);

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// Logout user
export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Create admin user for testing
export const createAdminUser = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@deliciousrestaurant.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPass123!';
    
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      logger.info('Admin user already exists');
      return;
    }

    const adminUser = new User({
      name: 'System Administrator',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      isActive: true,
      isVerified: true
    });

    await adminUser.save();
    logger.info(`Admin user created: ${adminEmail}`);
  } catch (error) {
    logger.error('Error creating admin user:', error);
  }
};

// Placeholder functions - to be implemented later
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  res.status(501).json({ message: 'Refresh token endpoint not implemented yet' });
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  res.status(501).json({ message: 'Forgot password endpoint not implemented yet' });
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  res.status(501).json({ message: 'Reset password endpoint not implemented yet' });
};

export const updatePassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
  res.status(501).json({ message: 'Update password endpoint not implemented yet' });
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  res.status(501).json({ message: 'Verify email endpoint not implemented yet' });
};

export const resendVerificationEmail = async (req: Request, res: Response, next: NextFunction) => {
  res.status(501).json({ message: 'Resend verification email endpoint not implemented yet' });
};
