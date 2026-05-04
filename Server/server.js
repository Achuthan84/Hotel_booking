import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/db.js";
import { clerkMiddleware } from '@clerk/express';
import clerkWebhooks from './controllers/clerkWebHook.js';
import UserRoute from "./routes/userRoute.js";
import HotelRoute from "./routes/hotelRoute.js";
import RoomRoute from "./routes/roomRoute.js";
import Bookings from "./routes/bookingsRoute.js";
import connectCloudinary from "./config/cloudinary.js";

connectDB();
connectCloudinary();

const app = express();

const normalizeOrigin = (origin) => origin?.trim().replace(/\/$/, "");
const allowedOrigins = [
  normalizeOrigin(process.env.FRONTEND_URL),
  "http://localhost:5173",
  "http://127.0.0.1:5173",
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.post('/api/clerk', express.raw({ type: 'application/json' }), clerkWebhooks);

app.use(clerkMiddleware({
  authorizedParties: allowedOrigins
}));
app.use(express.json());

app.get('/', (req, res) => { res.send("API IS WORKING") });
app.use('/api/user', UserRoute)
app.use('/api/hotels', HotelRoute)
app.use('/api/rooms', RoomRoute)
app.use('/api/bookings', Bookings)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`SERVER IS RUNNING ON PORT ${PORT}`));

export default app