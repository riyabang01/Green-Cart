import dns from 'node:dns'; 
dns.setServers(['8.8.8.8', '8.8.4.4']);

import 'dotenv/config';
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is missing");
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            bufferCommands: false
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
            return mongooseInstance;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        console.error(error.message);
        throw error;
    }

    return cached.conn;
};

export default connectDB;
