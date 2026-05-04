import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getUserData, storeSearch } from '../controllers/userController.js';

const route = express.Router();

route.get('/', protect, getUserData)
route.post('/store-recent-search', protect, storeSearch)

export default route;
