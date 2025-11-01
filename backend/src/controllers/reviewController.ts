import { Request, Response, NextFunction } from 'express';
import Review from '../models/Review';
import { AuthRequest } from '../middleware/auth';

export const getAllReviews = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const reviews = await Review.find({ isPublished: true, moderationStatus: 'approved' }).sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', results: reviews.length, data: { reviews } });
  } catch (err) { next(err); }
};

export const getMenuItemReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reviews = await Review.find({ menuItem: req.params.itemId, isPublished: true, moderationStatus: 'approved' })
      .sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', results: reviews.length, data: { reviews } });
  } catch (err) { next(err); }
};

export const getReviewStats = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await (Review as any).getStatistics();
    res.status(200).json({ status: 'success', data: stats });
  } catch (err) { next(err); }
};

export const getMyReviews = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const reviews = await Review.find({ customer: req.user!._id }).sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', results: reviews.length, data: { reviews } });
  } catch (err) { next(err); }
};

export const createReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const review = await Review.create({
      customer: req.user!._id,
      order: req.body.order,
      menuItem: req.body.menuItem,
      rating: req.body.rating,
      title: req.body.title,
      comment: req.body.comment,
      isVerified: false,
      isPublished: true,
      moderationStatus: 'approved',
      helpfulVotes: 0,
      reportCount: 0
    });
    res.status(201).json({ status: 'success', data: { review } });
  } catch (err) { next(err); }
};

export const updateReview = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const review = await Review.findOneAndUpdate(
      { _id: req.params.id, customer: req.user!._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!review) {
      res.status(404).json({ status: 'fail', message: 'Review not found' });
      return;
    }
    res.status(200).json({ status: 'success', data: { review } });
  } catch (err) { next(err); }
};

export const deleteReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await Review.findOneAndDelete({ _id: req.params.id, customer: req.user!._id });
    res.status(204).json({ status: 'success' });
  } catch (err) { next(err); }
};

export const markHelpful = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      res.status(404).json({ status: 'fail', message: 'Review not found' });
      return;
    }
    await (review as any).addHelpfulVote();
    res.status(200).json({ status: 'success', data: { review } });
  } catch (err) { next(err); }
};

export const reportReview = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      res.status(404).json({ status: 'fail', message: 'Review not found' });
      return;
    }
    await (review as any).report();
    res.status(200).json({ status: 'success', data: { review } });
  } catch (err) { next(err); }
};

export const approveReview = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      res.status(404).json({ status: 'fail', message: 'Review not found' });
      return;
    }
    await (review as any).approve(req.user!._id, req.body.notes);
    res.status(200).json({ status: 'success', data: { review } });
  } catch (err) { next(err); }
};

export const rejectReview = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      res.status(404).json({ status: 'fail', message: 'Review not found' });
      return;
    }
    await (review as any).reject(req.user!._id, req.body.notes);
    res.status(200).json({ status: 'success', data: { review } });
  } catch (err) { next(err); }
};

export const respondToReview = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      res.status(404).json({ status: 'fail', message: 'Review not found' });
      return;
    }
    await (review as any).addResponse(req.body.content, req.user!._id);
    res.status(200).json({ status: 'success', data: { review } });
  } catch (err) { next(err); }
};


