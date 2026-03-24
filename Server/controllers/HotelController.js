import Hotel from "../models/Hotel.js";
import User from "../models/user.js"

export const RegisterHotel = async (req, res) => {
    try {
        const { name, address, contact, city } = req.body;
        const owner = req.user._id;
        const hotel = await Hotel.findOne({ owner })
        if (hotel) {
            return res.status(302).json({
                success: false,
                message: "Hotel Already Registered"
            })
        }
        const createHotel = await Hotel.create({ name, address, contact, city, owner })
        await User.findByIdAndUpdate(owner, { role: "owner" })

        res.status(200).json({
            success: true,
            message: "Hotel Registered successfully",
            data: createHotel
        })
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        })
    }
}