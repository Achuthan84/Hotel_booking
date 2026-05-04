import transporter from "../config/nodemailer.js";
import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

// Function
export const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
    try {
        const booking = await Booking.find({
            room,
            checkInDate: { $lte: checkOutDate },
            checkOutDate: { $gt: checkInDate }
        });
        const isAvailable = booking.length === 0;
        return isAvailable;
    } catch (error) {
        console.log(error.message)
    }
}

// API
export const checkAvailabilityAPI = async (req, res) => {
    try {
        const { room, checkInDate, checkOutDate } = req.body;
        const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room })
        res.status(200).json({
            success: true,
            isAvailable
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

export const createBooking = async (req, res) => {
    try {
        const { room, checkInDate, checkOutDate, guests } = req.body;
        const user = req.user._id;

        const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room });
        if (!isAvailable) {
            return res.json({
                success: false,
                message: "Room is not Available"
            })
        }

        const roomData = await Room.findById(room).populate('hotel');

        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const timeDiff = checkOut.getTime() - checkIn.getTime();
        const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
        const totalPrice = roomData.pricePerNight * nights;

        const booking = await Booking.create({
            user,
            room,
            hotel: roomData.hotel._id,
            guests: +guests,
            checkInDate,
            checkOutDate,
            totalPrice
        })

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: req.user.email,
            subject: 'Hotel Bookings Details',
            html: `
                 <h2>Your Booking Details</h2>
                 <p>Dear ${req.user.username},</p>
                 <p>Thank you for your booking! Here are your details:</p>
                 <ul>
                     <li><strong>Booking ID:</strong> ${booking._id}</li>
                     <li><strong>Hotel Name:</strong> ${roomData.hotel.name}</li>
                     <li><strong>Location:</strong> ${roomData.hotel.address}</li>
                     <li><strong>Check-In Date:</strong> ${booking.checkInDate.toDateString()}</li>
                     <li><strong>Booking Amount:</strong> ${process.env.CURRENCY || '₹'} ${booking.totalPrice}</li>
                  </ul>
                  <p>We look forward to welcoming you!</p>
                  <p>If you need to make any changes, feel free to contact us.</p>`
        }
        try {
            await transporter.sendMail(mailOption)
            console.log('Email sent successfully')
        } catch (mailError) {
            console.log('Email failed:', mailError.message)
        }

        res.status(200).json({
            success: true,
            booking,
            message: "Booking created successfully"
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

export const getUserBooking = async (req, res) => {
    try {
        const user = req.user._id;
        // ✅ await the query, then populate with correct lowercase model field names
        const bookings = await Booking.find({ user })
            .populate('room')
            .populate('hotel')
            .sort({ createdAt: -1 })
        res.status(200).json({
            success: true,
            bookings
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

export const getHotelBookings = async (req, res) => {
    try {
        const hotel = await Hotel.findOne({ owner: req.auth.userId }); // ✅ req.auth.userId not req.auth().userId
        if (!hotel) {
            return res.status(404).json({  // ✅ added return
                success: false,
                message: "Hotel not Found"
            })
        }
        const bookings = await Booking.find({ hotel: hotel._id })
            .populate('room')
            .populate('hotel')
            .populate('user')
            .sort({ createdAt: -1 })

        const totalBookings = bookings.length;
        const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0) // ✅ totalRevence → totalRevenue

        res.status(200).json({
            success: true,
            dashboardData: {
                totalBookings,
                totalRevenue,
                bookings
            }
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}