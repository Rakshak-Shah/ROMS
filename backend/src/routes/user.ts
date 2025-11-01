import express from 'express';
import { protect, checkOwnership } from '../middleware/auth';
import {
  getProfile,
  updateProfile,
  deleteAccount,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  getPreferences,
  updatePreferences,
  getOrderHistory,
  getOrderHistoryById,
  getReservationHistory
} from '../controllers/userController';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Profile routes
router.get('/profile', getProfile);
router.patch('/profile', updateProfile);
router.delete('/profile', deleteAccount);

// Address management
router.get('/addresses', getAddresses);
router.post('/addresses', addAddress);
router.patch('/addresses/:id', updateAddress);
router.delete('/addresses/:id', deleteAddress);

// Preferences
router.get('/preferences', getPreferences);
router.patch('/preferences', updatePreferences);

// Order history
router.get('/orders', getOrderHistory);
router.get('/orders/:id', getOrderHistoryById);

// Reservation history
router.get('/reservations', getReservationHistory);

export default router;
