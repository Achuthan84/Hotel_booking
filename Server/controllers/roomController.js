import Hotel from "../models/Hotel.js";
import { v2 as cloudinary } from 'cloudinary'
import Room from '../models/Room.js'

export const createroom = async (req, res) => {
    try {
        const { roomType, pricePerNight, amenities } = req.body;
        const userId = req.user?._id || req.auth?.()?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Not authenticated"
            })
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please upload at least 4 images"
            })
        }
        if (req.files.length < 4) {
            return res.status(400).json({
                success: false,
                message: "Please upload 4 images"
            })
        }

        const hotel = await Hotel.findOne({ owner: userId })
        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: "Hotel Not Found"
            })
        }

        const uploadimage = req.files.map(async (file) => {
            if (!file?.buffer || !file?.mimetype) {
                throw new Error("Image upload failed: invalid file upload");
            }

            const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

            try {
                const response = await cloudinary.uploader.upload(dataUri, {
                    resource_type: "image",
                    folder: "hotel_booking/rooms",
                });
                return response.secure_url;
            } catch (err) {
                const details = {
                    message: err?.message,
                    http_code: err?.http_code,
                    name: err?.name,
                    cloudinary: err?.error,
                    responseStatus: err?.response?.statusCode,
                    responseBody: err?.response?.body,
                };
                console.error("Cloudinary upload failed:", details);
                throw err;
            }
        })

        const images = await Promise.all(uploadimage);

        await Room.create({
            hotel: hotel._id,
            roomType,
            pricePerNight: +pricePerNight,
            amenities: JSON.parse(amenities),
            images
        })
        res.status(201).json({
            success: true,
            message: "Room created successfully"
        })
    } catch (error) {
        console.error("Create room error:", {
            message: error?.message,
            http_code: error?.http_code,
            name: error?.name,
            cloudinary: error?.error,
            responseStatus: error?.response?.statusCode,
            responseBody: error?.response?.body,
        });
        res.status(400).json({
            success: false,
            message: error?.error?.message || error?.message || "Failed to create room"
        })
    }
}

export const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find({ isAvailable: true }).populate({
            path: 'hotel',
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
            success: false,
            message: err.message
        })
    }
}

export const getOwnerRoom = async (req, res) => {
    try {
        const userId = req.user?._id || req.auth?.()?.userId;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Not authenticated"
            })
        }

        const hotelData = await Hotel.findOne({ owner: userId });

        if (!hotelData) {
            return res.status(404).json({
                success: false,
                message: "Hotel Not Found"
            })
        }

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