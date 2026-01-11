import { resend } from "../config/resend.js";
import logger from "../utils/logger.js";

export async function sendEmail(to: string, subject: string, html: string) {
    try {
        const response = await resend.emails.send({
            from: process.env.SENDER_EMAIL as string,
            to,
            subject,
            html
        })

        return response;
    } catch (error) {
        logger.error('Resend Error: ', error);
        throw error;
    }
}