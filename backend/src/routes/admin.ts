import express from 'express';
import { protect, restrictTo } from '../middleware/auth';
import {
  getDashboard,
  getAnalytics,
  getSalesReport,
  getOrderReport,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  activateUser,
  deactivateUser,
  getConfig,
  updateConfig,
  createBackup,
  restoreBackup
} from '../controllers/adminController';
import {
  getAllOrders,
  updateOrderStatus,
  deleteOrder
} from '../controllers/orderController';
import {
  getAllReservations,
  confirmReservation,
  updateReservationStatus
} from '../controllers/reservationController';
import {
  getAllMenuItemsAdmin,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} from '../controllers/menuController';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(restrictTo('admin', 'staff'));

// Dashboard and Analytics
router.get('/dashboard', getDashboard);
router.get('/analytics', getAnalytics);
router.get('/reports/sales', getSalesReport);
router.get('/reports/orders', getOrderReport);

// User/Staff Management
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/activate', activateUser);
router.patch('/users/:id/deactivate', deactivateUser);

// Order Management
router.get('/orders', getAllOrders);
router.patch('/orders/:id/status', updateOrderStatus);
router.delete('/orders/:id', deleteOrder);

// Reservation Management
router.get('/reservations', getAllReservations);
router.post('/reservations/:id/confirm', confirmReservation);
router.patch('/reservations/:id/status', updateReservationStatus);

// Menu Management
router.get('/menu', getAllMenuItemsAdmin);
router.post('/menu', createMenuItem);
router.patch('/menu/:id', updateMenuItem);
router.delete('/menu/:id', deleteMenuItem);

// System Configuration
router.get('/config', getConfig);
router.patch('/config', updateConfig);
router.post('/backup', createBackup);
router.post('/restore', restoreBackup);

export default router;
