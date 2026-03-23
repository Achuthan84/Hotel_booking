import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { RegisterHotel } from "../controllers/HotelController.js";


const route = express.Router();

route.post("/", protect, RegisterHotel)

export default route;