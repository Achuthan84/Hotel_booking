import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createroom } from '../controllers/romController.js';

const route = express.Router();

route.post("/", createroom)

export default route;
