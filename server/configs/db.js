import mongoose from "mongoose";

const connectDB = async () => {
    try {
        if (mongoose.connection.readyState >= 1) {
            return;
        }

        mongoose.connection.on('connected', () => console.log("Database Connected"));
        mongoose.connection.on('error', (err) => console.log("Mongoose Error:", err));

        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is undefined in process.env");
        }

        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
    } catch (error) {
        console.log("Database connection error:", error.message);
    }
}

export default connectDB;
