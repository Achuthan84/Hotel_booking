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

// DB + Cloudinary connect
connectDB();
connectCloudinary();

const app = express();

// ---------- CORS CONFIG (FIXED) ----------
const normalizeOrigin = (origin) => origin?.trim().replace(/\/$/, "");

const allowedOrigins = [
  normalizeOrigin(process.env.FRONTEND_URL),
  "http://localhost:5173",
  "http://127.0.0.1:5173",
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      const normalized = normalizeOrigin(origin);

      // allow vercel domains dynamically
      if (
        allowedOrigins.includes(normalized) ||
        normalized.includes("vercel.app")
      ) {
        callback(null, true);
      } else {
        console.log("❌ Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ---------- WEBHOOK ----------
app.post(
  "/api/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhooks
);

// ---------- MIDDLEWARE ----------
app.use(express.json());

app.use(clerkMiddleware());


app.use("/uploads", express.static("uploads"));

// ---------- ROUTES ----------
app.get("/", (req, res) => {
  res.send("API IS WORKING");
});

app.use("/api/user", UserRoute);
app.use("/api/hotels", HotelRoute);
app.use("/api/rooms", RoomRoute);
app.use("/api/bookings", Bookings);

// ---------- SERVER ----------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`🚀 SERVER RUNNING ON PORT ${PORT}`)
);