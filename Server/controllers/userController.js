export const getUserData = async (req, res) => {
    try {
        const role = req.user.role;
        const recentSearchedCities = req.user.recentSearchedCities;
        res.status(200).json({
            success: true,
            role,
            recentSearchedCities
        })
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

export const storeSearch = async (req, res) => {
    try {
        const { recentSearchedCities } = req.body;
        const user = req.user;
        if (user.recentSearchedCities.length >= 3) {
            user.recentSearchedCities.shift();
            user.recentSearchedCities.push(recentSearchedCities)
        } else {
            user.recentSearchedCities.push(recentSearchedCities)
        }
        await user.save();
        res.status(200).json({
            success: true,
            message: "City added"
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}