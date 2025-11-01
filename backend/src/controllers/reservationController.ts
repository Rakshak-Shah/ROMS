import { Request, Response, NextFunction } from 'express';
import Reservation from '../models/Reservation';
import { AuthRequest } from '../middleware/auth';

export const getMyReservations = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const reservations = await Reservation.find({ customer: req.user!._id }).sort({ date: -1, time: -1 });
    res.status(200).json({ status: 'success', results: reservations.length, data: { reservations } });
  } catch (err) { next(err); }
};

export const getReservationById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      res.status(404).json({ status: 'fail', message: 'Reservation not found' });
      return;
    }
    const isOwner = reservation.customer.toString() === req.user!._id.toString();
    const isPrivileged = ['admin', 'staff'].includes(req.user!.role);
    if (!isOwner && !isPrivileged) {
      res.status(403).json({ status: 'fail', message: 'Forbidden' });
      return;
    }
    res.status(200).json({ status: 'success', data: { reservation } });
  } catch (err) { next(err); }
};

export const createReservation = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const reservation = await Reservation.create({
      customer: req.user!._id,
      customerInfo: req.body.customerInfo,
      date: req.body.date,
      time: req.body.time,
      guests: req.body.guests,
      specialRequests: req.body.specialRequests
    });
    res.status(201).json({ status: 'success', data: { reservation } });
  } catch (err) { next(err); }
};

export const updateReservation = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!reservation) {
      res.status(404).json({ status: 'fail', message: 'Reservation not found' });
      return;
    }
    res.status(200).json({ status: 'success', data: { reservation } });
  } catch (err) { next(err); }
};

export const cancelReservation = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      res.status(404).json({ status: 'fail', message: 'Reservation not found' });
      return;
    }
    await (reservation as any).cancel(req.body.reason, req.user!._id);
    res.status(200).json({ status: 'success', data: { reservation } });
  } catch (err) { next(err); }
};

export const getAllReservations = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const reservations = await Reservation.find().sort({ date: -1, time: -1 });
    res.status(200).json({ status: 'success', results: reservations.length, data: { reservations } });
  } catch (err) { next(err); }
};

export const confirmReservation = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      res.status(404).json({ status: 'fail', message: 'Reservation not found' });
      return;
    }
    await (reservation as any).confirm(req.body.tableNumber, req.user!._id);
    res.status(200).json({ status: 'success', data: { reservation } });
  } catch (err) { next(err); }
};

export const updateReservationStatus = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      res.status(404).json({ status: 'fail', message: 'Reservation not found' });
      return;
    }
    reservation.status = req.body.status;
    await reservation.save();
    res.status(200).json({ status: 'success', data: { reservation } });
  } catch (err) { next(err); }
};


