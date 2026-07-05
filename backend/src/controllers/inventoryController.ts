import { Response, NextFunction } from 'express';
import Inventory from '../models/Inventory';
import { AuthRequest } from '../middleware/auth';

// Get all inventory items
export const getAllInventory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { category, status } = req.query;
    
    const filter: any = {};
    if (category) filter.category = category;
    if (status) filter.status = status;

    const items = await Inventory.find(filter)
      .populate('createdBy', 'name')
      .populate('lastUpdatedBy', 'name')
      .sort({ itemName: 1 });

    res.status(200).json({
      status: 'success',
      results: items.length,
      data: { items }
    });
  } catch (err) {
    next(err);
  }
};

// Get single inventory item
export const getInventoryById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const item = await Inventory.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate('lastUpdatedBy', 'name');
    
    if (!item) {
      res.status(404).json({ status: 'fail', message: 'Inventory item not found' });
      return;
    }

    res.status(200).json({ status: 'success', data: { item } });
  } catch (err) {
    next(err);
  }
};

// Create new inventory item
export const createInventoryItem = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const item = await Inventory.create({
      ...req.body,
      createdBy: req.user!._id
    });

    res.status(201).json({
      status: 'success',
      message: 'Inventory item created successfully',
      data: { item }
    });
  } catch (err) {
    next(err);
  }
};

// Update inventory item
export const updateInventoryItem = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const item = await Inventory.findByIdAndUpdate(
      req.params.id,
      { ...req.body, lastUpdatedBy: req.user!._id },
      { new: true, runValidators: true }
    );

    if (!item) {
      res.status(404).json({ status: 'fail', message: 'Inventory item not found' });
      return;
    }

    res.status(200).json({
      status: 'success',
      message: 'Inventory item updated successfully',
      data: { item }
    });
  } catch (err) {
    next(err);
  }
};

// Delete inventory item
export const deleteInventoryItem = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await Inventory.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: 'success' });
  } catch (err) {
    next(err);
  }
};

// Restock inventory item
export const restockItem = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { quantity } = req.body;
    const item = await Inventory.findById(req.params.id);
    
    if (!item) {
      res.status(404).json({ status: 'fail', message: 'Inventory item not found' });
      return;
    }

    await (item as any).restock(quantity, req.user!._id);

    res.status(200).json({
      status: 'success',
      message: 'Item restocked successfully',
      data: { item }
    });
  } catch (err) {
    next(err);
  }
};

// Get low stock items
export const getLowStockItems = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const items = await Inventory.find({
      status: { $in: ['low-stock', 'out-of-stock'] }
    })
      .populate('createdBy', 'name')
      .sort({ quantity: 1 });

    res.status(200).json({
      status: 'success',
      results: items.length,
      data: { items }
    });
  } catch (err) {
    next(err);
  }
};

// Get inventory statistics
export const getInventoryStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const [totalItems, lowStockCount, outOfStockCount, expiredCount, totalValue] = await Promise.all([
      Inventory.countDocuments(),
      Inventory.countDocuments({ status: 'low-stock' }),
      Inventory.countDocuments({ status: 'out-of-stock' }),
      Inventory.countDocuments({ status: 'expired' }),
      Inventory.aggregate([
        { $group: { _id: null, total: { $sum: { $multiply: ['$quantity', '$costPerUnit'] } } } }
      ])
    ]);

    const categoryBreakdown = await Inventory.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, totalValue: { $sum: { $multiply: ['$quantity', '$costPerUnit'] } } } }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        totalItems,
        lowStockCount,
        outOfStockCount,
        expiredCount,
        totalValue: totalValue[0]?.total || 0,
        categoryBreakdown
      }
    });
  } catch (err) {
    next(err);
  }
};

