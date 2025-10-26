import { Request, Response } from "express";
import authService from "../services/auth.service";

class AuthController {
    async login(req: Request, res: Response) {
        try {
            const { username, password } = req.body;
            const result = await authService.loginAuthentication(username, password);
            console.log('In controller', result)
            if (!result) {
                return res.status(401).json({ message: "Invalid credentials" });
            }
            res.status(200).json({ message: "Login successful", data: { ...result, success: true } });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default new AuthController();