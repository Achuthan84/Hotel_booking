import User from '../models/user.js'

export const protect = async (req, res, next) => {
    try {
        const auth = req.auth();
        const userId = auth?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Not authenticated"
            })
        }

        const user = await User.findById(userId)
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            })
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message
        })
    }
}