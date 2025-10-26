// import { Request, Response } from "express";
// import { getChats } from "../services/otp.service";

// class OTPController {
//     async getChats(req: Request, res: Response) {
//         try {
//             const result = await getChats()

//             // sendOTPNumber(phoneNumber);
//             console.log('Result', result)
//             if (!result) {
//                 return res.status(500).json({ message: "Failed to send OTP", error: result });
//             }
//             res.status(200).json({ message: "OTP sent successfully", data: result });
//         } catch (error: any) {
//             res.status(500).json({ message: error.message });
//         }
//     }
// }

// export default new OTPController();