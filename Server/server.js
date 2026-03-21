import express from "express";
import "dotenv/config"
import cors from "cors";
import connectDB from "./config/db.js"
import { clerkMiddleware } from '@clerk/express'

connectDB();

const app = express();
app.use(cors())

app.use(express.json())
app.use(clerkMiddleware())

app.use("/api/clerk", clerkMiddleware)
app.get('/', (req, res) => {
    res.send("API IS WORKING")
})

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    console.log(`SERVER IS RUNNING ON PORT ${PORT}`)
})