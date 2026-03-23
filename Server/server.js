import express from "express";
import "dotenv/config"
import cors from "cors";
import connectDB from "./config/db.js"
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from './controllers/clerkWebHook.js'

connectDB();

const app = express();
app.use(cors())

app.use(clerkMiddleware())

// Webhook route must come BEFORE express.json() so svix gets the raw body
app.post('/api/clerk', express.raw({ type: 'application/json' }), clerkWebhooks)

app.use(express.json())

app.get('/', (req, res) => {
    res.send("API IS WORKING")
})

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    console.log(`SERVER IS RUNNING ON PORT ${PORT}`)
})