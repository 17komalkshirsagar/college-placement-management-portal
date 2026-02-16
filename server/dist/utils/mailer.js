import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
const transporter = nodemailer.createTransport({
    host: env.EMAIL_HOST,
    port: env.EMAIL_PORT,
    secure: env.EMAIL_PORT === 465,
    auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASSWORD,
    },
});
export async function sendMail(options) {
    await transporter.sendMail({
        from: env.EMAIL_FROM,
        ...options,
    });
}
