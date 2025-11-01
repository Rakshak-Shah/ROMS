import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import Order from '../models/Order';
import Reservation from '../models/Reservation';
import { AuthRequest } from '../middleware/auth';

export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user!._id);
    res.status(200).json({ status: 'success', data: { user } });
  } catch (err) { next(err); }
};

export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findByIdAndUpdate(req.user!._id, req.body, { new: true, runValidators: true });
    res.status(200).json({ status: 'success', data: { user } });
  } catch (err) { next(err); }
};

export const deleteAccount = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await User.findByIdAndDelete(req.user!._id);
    res.status(204).json({ status: 'success' });
  } catch (err) { next(err); }
};

export const getAddresses = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user!._id);
    res.status(200).json({ status: 'success', data: { addresses: user?.addresses || [] } });
  } catch (err) { next(err); }
};

export const addAddress = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.user!._id);
    if (!user) {
      res.status(404).json({ status: 'fail', message: 'User not found' });
      return;
    }
    user.addresses.push(req.body);
    await user.save();
    res.status(201).json({ status: 'success', data: { addresses: user.addresses } });
  } catch (err) { next(err); }
};

export const updateAddress = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.user!._id);
    if (!user) {
      res.status(404).json({ status: 'fail', message: 'User not found' });
      return;
    }
    const idx = user.addresses.findIndex(a => a.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ status: 'fail', message: 'Address not found' });
      return;
    }
    user.addresses[idx] = { ...user.addresses[idx], ...req.body } as any;
    await user.save();
    res.status(200).json({ status: 'success', data: { addresses: user.addresses } });
  } catch (err) { next(err); }
};

export const deleteAddress = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.user!._id);
    if (!user) {
      res.status(404).json({ status: 'fail', message: 'User not found' });
      return;
    }
    user.addresses = user.addresses.filter(a => a.id !== req.params.id);
    await user.save();
    res.status(200).json({ status: 'success', data: { addresses: user.addresses } });
  } catch (err) { next(err); }
};

export const getPreferences = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user!._id);
    res.status(200).json({ status: 'success', data: { preferences: user?.preferences } });
  } catch (err) { next(err); }
};

export const updatePreferences = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.user!._id);
    if (!user) {
      res.status(404).json({ status: 'fail', message: 'User not found' });
      return;
    }
    user.preferences = { ...user.preferences, ...req.body } as any;
    await user.save();
    res.status(200).json({ status: 'success', data: { preferences: user.preferences } });
  } catch (err) { next(err); }
};

export const getOrderHistory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const orders = await Order.find({ customer: req.user!._id }).sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', results: orders.length, data: { orders } });
  } catch (err) { next(err); }
};

export const getOrderHistoryById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const order = await Order.findOne({ _id: req.params.id, customer: req.user!._id });
    if (!order) {
      res.status(404).json({ status: 'fail', message: 'Order not found' });
      return;
    }
    res.status(200).json({ status: 'success', data: { order } });
  } catch (err) { next(err); }
};

export const getReservationHistory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const reservations = await Reservation.find({ customer: req.user!._id }).sort({ date: -1, time: -1 });
    res.status(200).json({ status: 'success', results: reservations.length, data: { reservations } });
  } catch (err) { next(err); }
};


