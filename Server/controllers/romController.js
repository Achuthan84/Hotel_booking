import Hotel from "../models/Hotel.js";

export const createroom = async (req, res) => {
    try {
        const { roomType, pricePerNight, amenities } = req.body;
        const hotel = await Hotel.findOne({ owner: req.auth.userId })
        if (hotel) {
            return res.status(404).json({
                success: false,
                message: "Hotel Not Found"
            })
        }
        console.log(hotel)
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}