import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

class FireOTP {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    async sendOTP(to: string, subject: string, html: string) {
        try {
            const info = await this.transporter.sendMail({
                from: `"MyApp" <${process.env.SMTP_USER}>`,
                to,
                subject,
                html,
            });

            console.log("✅ Email sent:", info.messageId);
            return info;
        } catch (error: any) {
            console.error("❌ Email send failed:", error.message);
            throw new Error("Failed to send email");
        }
    }
}

export default new FireOTP();
