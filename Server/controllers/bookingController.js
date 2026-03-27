import Booking from "../models/Booking";
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
        const roomData = await Room.findById(room).populate('')
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}