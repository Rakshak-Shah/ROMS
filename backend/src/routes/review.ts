import express from 'express';
import { protect, restrictTo, optionalAuth } from '../middleware/auth';
import {
  getAllReviews,
  getMenuItemReviews,
  getReviewStats,
  getMyReviews,
  createReview,
  updateReview,
  deleteReview,
  markHelpful,
  reportReview,
  approveReview,
  rejectReview,
  respondToReview
} from '../controllers/reviewController';

const router = express.Router();

// Public routes
router.get('/', optionalAuth, getAllReviews);
router.get('/menu-item/:itemId', getMenuItemReviews);
router.get('/stats', getReviewStats);

// Protected routes
router.use(protect);

router.get('/my-reviews', getMyReviews);
router.post('/', createReview);
router.patch('/:id', updateReview);
router.delete('/:id', deleteReview);
router.post('/:id/helpful', markHelpful);
router.post('/:id/report', reportReview);

// Admin routes
router.patch('/:id/approve', restrictTo('admin'), approveReview);
router.patch('/:id/reject', restrictTo('admin'), rejectReview);
router.post('/:id/respond', restrictTo('admin', 'staff'), respondToReview);

export default router;
