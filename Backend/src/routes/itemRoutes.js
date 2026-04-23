import express from 'express';
import { getItems, getItemById, createItem, updateItem, deleteItem, searchItems } from '../controllers/itemController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/search', searchItems);
router.route('/').get(getItems).post(protect, createItem);
router.route('/:id').get(getItemById).put(protect, updateItem).delete(protect, deleteItem);

export default router;