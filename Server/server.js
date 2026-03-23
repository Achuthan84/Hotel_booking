import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/db.js";
import { clerkMiddleware } from '@clerk/express';
import clerkWebhooks from './controllers/clerkWebHook.js';
import UserRoute from "./routes/userRoute.js";
import HotelRoute from "./routes/hotelRoute.js";

connectDB();

const app = express();
app.use(cors());

app.post('/api/clerk', express.raw({ type: 'application/json' }), clerkWebhooks);

app.use(clerkMiddleware());
app.use(express.json());

app.get('/', (req, res) => { res.send("API IS WORKING") });
app.use('/api/user', UserRoute)
app.use('/api/hotels', HotelRoute)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`SERVER IS RUNNING ON PORT ${PORT}`));