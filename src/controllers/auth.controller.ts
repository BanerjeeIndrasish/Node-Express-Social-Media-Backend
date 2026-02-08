import { Request, Response } from "express";
import authService from "../services/auth.service";
import fireotpService from "../services/fireotp.service";

class AuthController {
    async login(req: Request, res: Response) {
        try {
            // console.log('In controller')
            const { email, password } = req.body;
            const result = await authService.loginAuthentication(email, password);
            // console.log('In login controller', result)
            if (!result) {
                return res.status(401).json({ success: false, message: "Invalid credentials" });
            }
            res.status(200).json({ success: true, message: "Login successful", data: { ...result } });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async signup(req: Request, res: Response) {
        try {        
            const { name, email, password } = req.body;
            console.log('In controller', name, email, password)
            const result = await authService.signup(name, email, password);
            console.log('In signup controller', result)
            if (!result) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            const sendEmail = await fireotpService.sendOTP(result.user.email, 'Welcome to MyApp', `<h1>Welcome to MyApp</h1><p style="padding:10px; background-color:red;">Your account has been created successfully.</p>`);

            if (sendEmail) {
                console.log('Welcome email sent successfully');
            }

            res.status(200).json({ success: true, message: "Signup successful", data: { ...result } });

        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default new AuthController();