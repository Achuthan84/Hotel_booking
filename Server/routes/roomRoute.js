import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createroom, getOwnerRoom, getRooms, toggleRoomAvailability } from '../controllers/roomController.js';
import upload from '../middleware/uploadMiddleware.js';

const route = express.Router();

route.post("/", upload.any("image", 4), protect, createroom)
route.get("/", getRooms)
route.get("/owner", protect, getOwnerRoom)
route.post("/toggle-availability", protect, toggleRoomAvailability)

export default route;
