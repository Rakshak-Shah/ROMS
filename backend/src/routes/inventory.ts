import express from 'express';
import { protect, restrictTo } from '../middleware/auth';
import {
  getAllInventory,
  getInventoryById,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  restockItem,
  getLowStockItems,
  getInventoryStats
} from '../controllers/inventoryController';

const router = express.Router();

// All inventory routes require authentication and admin/staff role
router.use(protect);
router.use(restrictTo('admin', 'staff'));

router.get('/', getAllInventory);
router.get('/stats', getInventoryStats);
router.get('/low-stock', getLowStockItems);
router.get('/:id', getInventoryById);
router.post('/', createInventoryItem);
router.patch('/:id', updateInventoryItem);
router.delete('/:id', deleteInventoryItem);
router.post('/:id/restock', restockItem);

export default router;

