import type { Request, Response } from 'express';
import Users, { User } from '../models/user';
import { ApiResponse, CreateUserBody } from '../types/api';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12; // Recommended: between 10 and 14

type EmailParams = { emailId: string };
// Get User by email
export const getUser = async (
    req: Request<EmailParams>,
    res: Response<ApiResponse<User>>
): Promise<void> => {
    try {
        const user = await Users.findOne({ email: req.params.emailId }).lean();
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

// export const createUser = async (req: Request<CreateUserBody>, res: Response<ApiResponse<User>>) => {
//     try {
//         const { name, email, password } = req.body;
//         if (!name || !email || !password) {
//             return res.status(400).json({ message: 'Name, email, and password are required', success: false });
//         }
//         const existingUser = await Users.findOne({
//             email
//         });
//         if (existingUser) {
//             return res.status(409).json({ message: 'User already exists', success: false });
//         }
//         // hash password below
//         const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
//         const newUser = new Users({
//             name,
//             email,
//             hashedPassword // In production, hash the password before saving
//         });
//         await newUser.save();
//         res.status(201).json({ data: newUser, success: true });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', success: false });
//     }
// };

