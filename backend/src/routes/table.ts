import express from 'express';
import { protect, restrictTo } from '../middleware/auth';
import {
  getTableByQr,
  getAllTables,
  getTableById,
  createTable,
  updateTable,
  deleteTable,
  generateQrForTable,
  updateTableStatus
} from '../controllers/tableController';

const router = express.Router();

// Public route
router.get('/qr/:tableNumber', getTableByQr);

// Protected routes - Admin/Staff only
router.use(protect);
router.use(restrictTo('admin', 'staff'));

router.get('/', getAllTables);
router.get('/:id', getTableById);
router.post('/', createTable);
router.patch('/:id', updateTable);
router.delete('/:id', deleteTable);
router.post('/:id/generate-qr', generateQrForTable);
router.patch('/:id/status', updateTableStatus);

export default router;
