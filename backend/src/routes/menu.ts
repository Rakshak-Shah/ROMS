import express from 'express';
import { protect, restrictTo } from '../middleware/auth';
import {
  getAllMenuItems,
  getMenuItemById,
  getMenuItemsByCategory,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} from '../controllers/menuController';

const router = express.Router();

// Public routes
router.get('/', getAllMenuItems); // Get all menu items
router.get('/category/:category', getMenuItemsByCategory); // Get menu items by category
router.get('/:id', getMenuItemById); // Get single menu item

// Protected routes - admin only
router.use(protect);
router.use(restrictTo('admin', 'staff'));

router.post('/', createMenuItem); // Create menu item
router.patch('/:id', updateMenuItem); // Update menu item
router.delete('/:id', deleteMenuItem); // Delete menu item

export default router;
