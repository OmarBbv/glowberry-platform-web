import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || 'new_secret_key_value';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'new_secret_key_value';

function generateToken(payload) {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '5d' });
}

function generateRefreshToken(payload) {
    return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' })
}

export { generateRefreshToken, generateToken };
