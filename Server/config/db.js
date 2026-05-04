import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log("DATABASE CONNECTED"));
        await mongoose.connect(`${process.env.MONGODB_URL}/hotel-booking`)
    }
    catch (err) {
        console.log(err.message)
    }
}

export default connectDB;