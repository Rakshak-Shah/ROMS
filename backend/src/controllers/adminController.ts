import { Request, Response, NextFunction } from 'express';
import Order from '../models/Order';
import Review from '../models/Review';
import User from '../models/User';

export const getDashboard = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const [ordersCount, usersCount, reviewsCount] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments(),
      Review.countDocuments()
    ]);
    res.status(200).json({ status: 'success', data: { ordersCount, usersCount, reviewsCount } });
  } catch (err) { next(err); }
};

export const getAnalytics = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const salesByDay = await Order.aggregate([
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, total: { $sum: '$total' } } },
      { $sort: { _id: 1 } }
    ]);
    res.status(200).json({ status: 'success', data: { salesByDay } });
  } catch (err) { next(err); }
};

export const getSalesReport = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const report = await Order.aggregate([
      { $group: { _id: '$status', totalSales: { $sum: '$total' }, count: { $sum: 1 } } },
      { $sort: { totalSales: -1 } }
    ]);
    res.status(200).json({ status: 'success', data: { report } });
  } catch (err) { next(err); }
};

export const getOrderReport = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const report = await Order.aggregate([
      { $group: { _id: '$orderType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.status(200).json({ status: 'success', data: { report } });
  } catch (err) { next(err); }
};

export const getUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', results: users.length, data: { users } });
  } catch (err) { next(err); }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ status: 'fail', message: 'User not found' });
      return;
    }
    res.status(200).json({ status: 'success', data: { user } });
  } catch (err) { next(err); }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!user) {
      res.status(404).json({ status: 'fail', message: 'User not found' });
      return;
    }
    res.status(200).json({ status: 'success', data: { user } });
  } catch (err) { next(err); }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: 'success' });
  } catch (err) { next(err); }
};

export const activateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ status: 'fail', message: 'User not found' });
      return;
    }
    user.isActive = true;
    await user.save();
    res.status(200).json({ status: 'success', data: { user } });
  } catch (err) { next(err); }
};

export const deactivateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ status: 'fail', message: 'User not found' });
      return;
    }
    user.isActive = false;
    await user.save();
    res.status(200).json({ status: 'success', data: { user } });
  } catch (err) { next(err); }
};

export const getConfig = async (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    data: {
      FREE_DELIVERY_THRESHOLD: process.env.FREE_DELIVERY_THRESHOLD || '50',
      DEFAULT_DELIVERY_FEE: process.env.DEFAULT_DELIVERY_FEE || '5.99',
      TAX_RATE: process.env.TAX_RATE || '0.085'
    }
  });
};

export const updateConfig = async (req: Request, res: Response) => {
  // Stub: In a real app, persist to DB or config store
  res.status(200).json({ status: 'success', message: 'Config updated (stub)', data: req.body });
};

export const createBackup = async (_req: Request, res: Response) => {
  res.status(200).json({ status: 'success', message: 'Backup started (stub)' });
};

export const restoreBackup = async (_req: Request, res: Response) => {
  res.status(200).json({ status: 'success', message: 'Restore started (stub)' });
};


