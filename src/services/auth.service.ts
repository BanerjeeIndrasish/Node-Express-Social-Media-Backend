import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "../models/user.model";

dotenv.config();

interface UserType {
    id: string;
    username: string;
    email: string;
    password_hash: string;
}

class AuthService {
    async loginAuthentication(
        email: string,
        password: string
    ): Promise<{ user: any }> {
        try {
            const user = (await User.findOne({
                where: { email },
            })) as UserType | null;
            // console.log('User found:', user);
            if (!user) {
                throw new Error("Invalid username or password");
            }

            console.log("LOGIN DEBUG →", {
                password,
                password_hash: user.password_hash,
            });

            const isMatch = await bcrypt.compare(password, user.password_hash);
            if (!isMatch) {
                throw new Error("Invalid password");
            }

            const token = jwt.sign(
                { id: user.id, username: user.username, email: user.email },
                process.env.JWT_SECRET as string,
                { expiresIn: "1d" }
            );

            return {
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    userToken: token,
                    loginTime: new Date(),
                },
            };
        } catch (error: any) {
            throw new Error(error.message || "Login failed");
        }
    }

    async signup(name: string, email: string, password: string): Promise<{ user: any }> {
        try {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                throw new Error("User already exists with this email");
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = (await User.create({ username: name, email, password_hash: hashedPassword })) as unknown as UserType;

            const token = jwt.sign(
                { id: newUser.id, email: newUser.email },
                process.env.JWT_SECRET as string,
                { expiresIn: "1d" }
            );

            return {
                user: {
                    id: newUser.id,
                    username: newUser.username,
                    email: newUser.email,
                    userToken: token,
                    loginTime: new Date(),
                }
            };
        } catch (error: any) {
            throw new Error(error.message || "Signup failed");
        }
    }
}

export default new AuthService();
