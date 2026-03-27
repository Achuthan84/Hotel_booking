import Hotel from "../models/Hotel.js";
import { v2 as cloudinary } from 'cloudinary'
import Room from '../models/Room.js'

export const createroom = async (req, res) => {
    try {
        const { roomType, pricePerNight, amenities } = req.body;
        const hotel = await Hotel.findOne({ owner: req.auth.userId })
        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: "Hotel Not Found"
            })
        }
        const uploadimage = req.files.map(async (file) => {
            const response = await cloudinary.uploader.upload(file.path);
            return response.secure_url;
        })

        const image = await Promise.all(uploadimage);

        await Room.create({
            hotel: hotel._id,
            roomType,
            pricePerNight: +pricePerNight,
            amenities: JSON.parse(amenities),
            image
        })
        res.status(201).json({
            success: true,
            message: "Room created successfully"
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

export const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find({ isAvailable: true }).populate({
            path: 'Hotel',
            populate: {
                path: 'owner',
                select: 'image'
            }
        }).sort({ createdAt: -1 })
        res.status(200).json({
            success: true,
            rooms
        })
    } catch (err) {
        res.status(400).json({
            success: true,
            message: err.message
        })
    }
}

export const getOwnerRoom = async (req, res) => {
    try {
        const hotelData = await hotel({ owner: req.auth.usedId });
        const rooms = await Room.find({ hotel: hotelData._id.toString() }).populate("hotel")
        res.status(200).json({
            success: true,
            rooms
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

export const toggleRoomAvailability = async (req, res) => {
    try {
        const { roomId } = req.body;
        const roomData = await Room.findById(roomId);
        roomData.isAvailable = !roomData.isAvailable
        await roomData.save();
        res.status(200).json({
            success: true,
            message: "Room Availability Updated"
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}