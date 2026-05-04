import express from 'express'
import { protect } from "../middleware/authMiddleware.js";
import { checkAvailabilityAPI, createBooking, getHotelBookings, getUserBooking } from '../controllers/bookingController.js'; // ✅ checkAvailability → checkAvailabilityAPI

const route = express.Router();

route.post('/check-availability', protect, checkAvailabilityAPI)
route.post('/book', protect, createBooking)
route.get('/user', protect, getUserBooking) 
route.get('/hotel', protect, getHotelBookings)

export default route;