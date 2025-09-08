import type { Request, Response } from 'express';
import Users, { User } from '../models/user';
import { ApiResponse, AuthRequest, CreateUserBody } from '../types/api';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12; // Recommended: between 10 and 14

// Get User by email
export const getUser = async (
    req: AuthRequest,
    res: Response<ApiResponse<User>>
): Promise<void> => {
    try {
        const user = await Users.findOne({ _id: req.userId }).lean();
        if (!user) {
            res.status(404).json({ message: 'User not found', success: false });
            return;
        }
        res.status(200).json({
            success: true,
            data: user
        });
    } catch {
        res.status(500).json({ message: 'Server error', success: false });
    }
};

// Create a new user
export const createUser = async (userData: {
    name: string;
    email: string;
    password: string;
}): Promise<User | null> => {
    const { name, email, password } = userData;

    try {
        const existingUser = await Users.findOne({ email });
        if (existingUser) throw new Error('User already exists');
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const newUser = new Users({ name, email, password: hashedPassword });
        await newUser.save();
        return newUser.toObject(); // Convert Mongoose doc to plain object
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};
