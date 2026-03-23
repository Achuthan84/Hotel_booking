import User from '../models/user.js'

export const protect = async (req, res, next) => {
    const { userId } = req.auth;
    if (!userId) {
        res.status(400).json({
            success: false,
            message: "not authenticated"
        })
    } else {
        const user = await User.findById(userId);
        req.user = user;
        next();
    }

}