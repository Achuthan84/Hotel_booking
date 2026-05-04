import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["owner", "user"],
        default: "user"
    },
    recentSearchedCities: [{
        type: String,
        required: true,
    }]
}, { timestamps: true })

export default mongoose.model("User", userSchema);