import Auth from "../models/auth.model";
const jwt = require("jsonwebtoken");
import dotenv from 'dotenv';
// import bcrypt from "bcrypt";

dotenv.config();
interface UserPayload {
    id: string;
    username: string;
}

class AuthService {
    async loginAuthentication(username: string, password: string): Promise<{ user: any, token: string } | null> {
        try {
            const user: any = await Auth.findOne({ where: { name: username, password: password } });
            console.log('Auth Result', username, password, user)
            if (!user) return null;
            const secretkey: string = process.env.JWT_SECRET || '';
            if (!secretkey) {
                throw new Error('JWT_SECRET is not defined in environment variables');
            }
            const expiresIn: string = process.env.JWT_EXPIRES_IN || '7d';
            const payload: UserPayload = {
                id: user.id,
                username: user.name
            };

            // THIS IS THE CORRECT WAY TO CALL jwt.sign()
            const token = jwt.sign(
                payload,
                secretkey,
                { expiresIn }
            );
            return { user, token };
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}

export default new AuthService();