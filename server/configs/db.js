import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
    try {
        if (isConnected || mongoose.connection.readyState >= 1) {
            return mongoose.connection;
        }

        mongoose.connection.on('connected', () => {
            isConnected = true;
        });

        mongoose.connection.on('error', () => {
            isConnected = false;
        });

        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is missing");
        }

        return await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            bufferCommands: false
        });
    } catch (error) {
        console.log(error.message);
        throw error;
    }
}

export default connectDB;
