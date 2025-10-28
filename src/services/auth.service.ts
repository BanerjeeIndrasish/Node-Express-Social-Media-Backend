import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import AuthUsers from "../models/auth.model";

dotenv.config();

interface UserType {
    id: string;
    name: string;
    email: string;
    password: string;
}

class AuthService {
    async loginAuthentication(
        email: string,
        password: string
    ): Promise<{ message: string; token: string; user: any }> {
        try {
            const user = (await AuthUsers.findOne({ where: { email } })) as UserType | null;
            // console.log('User found:', user);
            if (!user) {
                throw new Error("Invalid username or password");
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new Error("Invalid username or password");
            }

            const token = jwt.sign(
                { id: user.id, username: user.name, email: user.email },
                process.env.JWT_SECRET as string,
                { expiresIn: "1d" }
            );

            return {
                message: "Login successful",
                token,
                user: {
                    id: user.id,
                    username: user.name,
                    email: user.email,
                },
            };
        } catch (error: any) {
            throw new Error(error.message || "Login failed");
        }
    }    
}

export default new AuthService();
