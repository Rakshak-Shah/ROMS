import { Request, Response, NextFunction } from 'express';
import Order, { IOrderItem } from '../models/Order';
import Review from '../models/Review';
import { AuthRequest } from '../middleware/auth';

export const getMyOrders = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const orders = await Order.find({ customer: req.user!._id }).sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', results: orders.length, data: { orders } });
  } catch (err) { next(err); }
};

export const getOrderById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404).json({ status: 'fail', message: 'Order not found' });
      return;
    }
    const isOwner = order.customer.toString() === req.user!._id.toString();
    const isPrivileged = ['admin', 'staff'].includes(req.user!.role);
    if (!isOwner && !isPrivileged) {
      res.status(403).json({ status: 'fail', message: 'Forbidden' });
      return;
    }
    res.status(200).json({ status: 'success', data: { order } });
  } catch (err) { next(err); }
};

export const createOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const body = req.body as Partial<{
      items: IOrderItem[];
      orderType: 'dine-in' | 'delivery' | 'takeout';
      tableNumber?: number;
      deliveryAddress?: any;
      paymentMethod: 'online' | 'cash' | 'card';
      specialInstructions?: string;
    }>;

    const order = new Order({
      customer: req.user!._id,
      customerInfo: { name: req.user!.name, email: req.user!.email, phone: req.user!.phone },
      items: body.items || [],
      orderType: body.orderType!,
      tableNumber: body.tableNumber,
      deliveryAddress: body.deliveryAddress,
      subtotal: 0,
      deliveryFee: 0,
      tax: 0,
      total: 0,
      paymentMethod: body.paymentMethod,
      paymentStatus: 'pending',
      status: 'pending',
      specialInstructions: body.specialInstructions
    });

    (order as any).calculateTotals();
    await order.save();
    res.status(201).json({ status: 'success', data: { order } });
  } catch (err) { next(err); }
};

export const cancelOrder = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404).json({ status: 'fail', message: 'Order not found' });
      return;
    }
    const isOwner = order.customer.toString() === req.user!._id.toString();
    const isPrivileged = ['admin', 'staff'].includes(req.user!.role);
    if (!isOwner && !isPrivileged) {
      res.status(403).json({ status: 'fail', message: 'Forbidden' });
      return;
    }
    if (['delivered', 'cancelled'].includes(order.status)) {
      res.status(400).json({ status: 'fail', message: 'Order cannot be cancelled' });
      return;
    }
    order.status = 'cancelled';
    await order.save();
    res.status(200).json({ status: 'success', data: { order } });
  } catch (err) { next(err); }
};

export const addOrderReview = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404).json({ status: 'fail', message: 'Order not found' });
      return;
    }
    if (order.customer.toString() !== req.user!._id.toString()) {
      res.status(403).json({ status: 'fail', message: 'Forbidden' });
      return;
    }
    const { rating, title, comment } = req.body;
    const review = await Review.create({
      customer: req.user!._id,
      order: order._id,
      rating,
      title,
      comment,
      isVerified: true,
      isPublished: true,
      moderationStatus: 'approved',
      helpfulVotes: 0,
      reportCount: 0
    });
    res.status(201).json({ status: 'success', data: { review } });
  } catch (err) { next(err); }
};

export const getAllOrders = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', results: orders.length, data: { orders } });
  } catch (err) { next(err); }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, note } = req.body as { status: string; note?: string };
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404).json({ status: 'fail', message: 'Order not found' });
      return;
    }
    await (order as any).updateStatus(status, note, req.user!._id);
    res.status(200).json({ status: 'success', data: { order } });
  } catch (err) { next(err); }
};

export const deleteOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: 'success' });
  } catch (err) { next(err); }
};


