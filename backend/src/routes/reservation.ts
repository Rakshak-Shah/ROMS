import express from 'express';
import { protect, restrictTo } from '../middleware/auth';
import {
  getMyReservations,
  getReservationById,
  createReservation,
  updateReservation,
  cancelReservation,
  getAllReservations,
  confirmReservation,
  updateReservationStatus
} from '../controllers/reservationController';

const router = express.Router();

// Protected routes
router.use(protect);

router.get('/my-reservations', getMyReservations);
router.get('/:id', getReservationById);
router.post('/', createReservation);
router.patch('/:id', updateReservation);
router.delete('/:id', cancelReservation);

// Admin/Staff routes
router.get('/', restrictTo('admin', 'staff'), getAllReservations);
router.patch('/:id/confirm', restrictTo('admin', 'staff'), confirmReservation);
router.patch('/:id/status', restrictTo('admin', 'staff'), updateReservationStatus);

export default router;
