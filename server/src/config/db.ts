import mongoose from 'mongoose';
import dotenv from 'dotenv';
import config from './config';

dotenv.config(); // Load environment variables from .env

const connectDB = async () => {
    try {
        const mongoUri = config.databaseUrl;

        if (!mongoUri) {
            throw new Error('MongoDB URI not found in environment variables.');
        }

        await mongoose.connect(mongoUri);
        console.log('MongoDB connected successfully');
    } catch (err: any) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1); // Exit process on connection failure
    }
};

// Listen for disconnection events.
mongoose.connection.on('disconnected', () => {
    console.warn('Mongoose disconnected from MongoDB. Reconnecting...');
    connectDB(); // Attempt to reconnect
});

// Handle graceful shutdown.
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('Mongoose connection disconnected through app termination.');
    process.exit(0);
});


export default connectDB;

