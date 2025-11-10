import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter;

    constructor() {
        // SMTP sozlamalarini environment variable orqali olish tavsiya qilinadi
        this.transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,  // smtp.gmail.com
            port: Number(process.env.MAIL_PORT) || 465,
            secure: true,  // 465 port uchun true
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });
    }

    async sendOTP(email: string, otp: string) {
        try {
            await this.transporter.sendMail({
                from: `"Uy Joy Ijarasi" <${process.env.MAIL_USER}>`,
                to: email,
                subject: 'Your OTP Code',
                text: `Sizning OTP kodingiz: ${otp}. Kod 5 daqiqa ichida amal qiladi.`,
            });
        } catch (error) {
            console.error("Mail jo'natishda xato:", error);
            throw new InternalServerErrorException("Email jo'natishda xatolik yuz berdi ❌");
        }
    }
}