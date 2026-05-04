import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { RegisterHotel } from '../controllers/HotelController.js';

const route = express.Router();

// Register a hotel for the authenticated user (owner)
route.post('/', protect, RegisterHotel);

export default route;
