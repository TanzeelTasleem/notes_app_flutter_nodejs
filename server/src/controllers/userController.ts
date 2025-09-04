import type { Request, Response } from 'express';
import Users, { User } from '../models/user.js';
import ApiResponse from '../types/api.js';

type EmailParams = { emailId: string };
type CreateUserBody = { name: string; email: string; password: string };

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


export const createUser = async (req: Request<CreateUserBody>, res: Response<ApiResponse<User>>) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required', success: false });
        }
        const existingUser = await Users.findOne({
            email
        });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists', success: false });
        }
        // hash password below
        const newUser = new Users({
            name,
            email,
            password // In production, hash the password before saving
        });
        await newUser.save();
        res.status(201).json({ data: newUser, success: true });
    } catch (error) {
        res.status(500).json({ message: 'Server error', success: false });
    }
};