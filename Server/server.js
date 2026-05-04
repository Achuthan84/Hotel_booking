import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";
import clerkWebhooks from "./controllers/clerkWebHook.js";
import UserRoute from "./routes/userRoute.js";
import HotelRoute from "./routes/hotelRoute.js";
import RoomRoute from "./routes/roomRoute.js";
import Bookings from "./routes/bookingsRoute.js";
import connectCloudinary from "./config/cloudinary.js";

connectDB();
connectCloudinary();

const app = express();

const normalizeOrigin = (origin) => origin?.trim().replace(/\/$/, "");

const vercelFrontendUrl = process.env.VERCEL_URL
  ? `https://${normalizeOrigin(process.env.VERCEL_URL)}`
  : null;

const allowedOrigins = [
  normalizeOrigin(process.env.FRONTEND_URL),
  normalizeOrigin("https://quickstay-three-azure.vercel.app"),
  vercelFrontendUrl,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
].filter(Boolean);

console.log("Allowed CORS origins:", allowedOrigins);

app.post(
  "/api/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhooks
);

app.use(express.json());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS origin denied: ${origin}`));
    },
    credentials: true,
  })
);


app.use(
  clerkMiddleware({
    authorizedParties: allowedOrigins,
  })
);

app.get("/", (req, res) => {
  res.send("API IS WORKING");
});

app.use("/api/user", UserRoute);
app.use("/api/hotels", HotelRoute);
app.use("/api/rooms", RoomRoute);
app.use("/api/bookings", Bookings);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
});

export default app;