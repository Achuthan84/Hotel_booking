import Booking from "../models/Booking";
import Hotel from "../models/Hotel";
import Room from "../models/Room";


//Function
export const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
    try {
        const booking = await Booking.find({
            room,
            checkInDate: { $lte: checkOutDate },
            checkOutDate: { $glt: checkInDate }
        });
        const isAvailable = booking.length === 0;
        return isAvailable;
    } catch (error) {
        console.log(error.message)
    }
}

//API
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
        const roomData = await Room.findById(room).populate('Hotel');
        let totalprice = roomData.pricePerNight;
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const timeDiff = checkOut.getTime() - checkIn.getTime();
        const nights = Math.ceil(timeDiff / (1000 * 3600 * 24))
        totalprice *= nights;

        const booking = await Booking.create({
            user,
            room,
            hotel: roomData.hotel._id,
            guests: +guests,
            checkInDate,
            checkOutDate,
            totalPrice
        })
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
        const booking = (await Booking.find({ user })).populate("Room Hotel").sort({ createdAt: -1 })
        res.status(200).json({
            success: true,
            booking
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
        const hotel = await Hotel.findOne({ owner: req.auth.userId });
        if (!hotel) {
            res.status(400).json({
                success: false,
                message: "Hotel not Found"
            })
        }
        const bookings = await Booking.find({ hotel: hotel._id }).populate("Room Hotel User").sort({ createdAt: -1 })
        const totalBookings = bookings.length;
        const totalRevence = bookings.reduce((acc, Booking) => acc + Booking.totalPrice, 0)
        res.status(200).json({
            success: true,
            dashboardData: {
                totalBookings,
                totalRevence,
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