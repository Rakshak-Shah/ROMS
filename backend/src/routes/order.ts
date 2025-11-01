import express from 'express';
import { protect, restrictTo } from '../middleware/auth';
import {
  getMyOrders,
  getOrderById,
  createOrder,
  cancelOrder,
  addOrderReview,
  getAllOrders,
  updateOrderStatus,
  deleteOrder
} from '../controllers/orderController';

const router = express.Router();

// Protected routes - require authentication
router.use(protect);

// Customer routes
router.get('/my-orders', getMyOrders);
router.get('/:id', getOrderById);
router.post('/', createOrder);
router.patch('/:id/cancel', cancelOrder);
router.post('/:id/review', addOrderReview);

// Staff/Admin routes
router.get('/', restrictTo('admin', 'staff'), getAllOrders);
router.patch('/:id/status', restrictTo('admin', 'staff'), updateOrderStatus);
router.delete('/:id', restrictTo('admin'), deleteOrder);

export default router;
