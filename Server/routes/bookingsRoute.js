import express from 'express'
import { protect } from "../middleware/authMiddleware.js";
import { checkAvailability, createBooking, getHotelBookings, getUserBooking } from '../controllers/bookingController.js';

const route = express.Router();

route.post('/check-availability', protect, checkAvailability)
route.post('/book', protect, createBooking)
route.post('/user', protect, getUserBooking)
route.post('/hotel', protect, getHotelBookings)


export default route;