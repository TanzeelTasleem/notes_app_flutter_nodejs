import { Request, Response } from "express";
import { ApiResponse, CreateUserBody } from "../types/api";
import { createUser } from "./userController";
import Users, { User } from "../models/user";
import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET: string = process.env.JWT_SECRET ?? "note_app_secret";

export const registerUser = async (req: Request<CreateUserBody>, res: Response<ApiResponse<Omit<User, "_id" | "password"> & { token: string }>>) => {
    try {
        const user = await createUser(req.body);
        if (!user || user === null) {
            return res.status(400).json({ message: 'User creation failed', success: false });
        }
        const token = generateToken(user);
        const { password, _id , ...userWithoutPassword } = user; // Exclude password
        res.status(201).json({ data: { ...userWithoutPassword, token }, success: true });
    } catch (error) {
        res.status(500).json({ message: error?.toString() ||'Server error', success: false });
    }
};

export const signInUser = async (req: Request<Omit<CreateUserBody, "name">>, res: Response<ApiResponse<Omit<User, "_id" | "password">  & { token: string }>>) => {
    console.log("hitt:::", req.body);
    try {
        if (!req.body.email || !req.body.password || !req.body) {
            return res.status(400).json({ message: 'Email and password are required', success: false });
        }
        const { email, password } = req.body;
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'No User Found with this Credentials', success: false });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials', success: false });
        }
        const { password: pwd, _id, ...userWithoutPassword } = user.toObject(); // Exclude password
        const token = generateToken(user);
        res.status(200).json({ data: { ...userWithoutPassword, token }, success: true });
        return;
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', success: false });
    }
}

const signOptions: SignOptions = {
    expiresIn: '1d',
};

const generateToken = (user: User): string => {
    return jwt.sign({ id: user.email }, JWT_SECRET, signOptions);
};
