import express from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  updatePassword,
  verifyEmail,
  resendVerificationEmail
} from '../controllers/authController';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = express.Router();

// Register validation
const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('phone')
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number'),
];

// Login validation
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// Password validation
const passwordValidation = [
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

// Reset password validation
const resetPasswordValidation = [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

// Public routes
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', 
  [body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email')],
  validate,
  forgotPassword
);
router.patch('/reset-password', resetPasswordValidation, validate, resetPassword);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', 
  [body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email')],
  validate,
  resendVerificationEmail
);

// Protected routes
router.patch('/update-password', protect, passwordValidation, validate, updatePassword);

export default router;
