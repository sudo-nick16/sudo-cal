import nodemailer from "nodemailer";
import { SMTP_PASS, SMTP_USER } from "./constants.js";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
    },
});

export async function sendMail(to, body) {
    const info = await transporter.sendMail({
        from: "sudo cal",
        to: to,
        subject: "Meet Invite",
        attachments: [
            {
                filename: "invite.ics",
                content: body,
            },
        ],
    });
    console.log("Invite sent to %s (%s)", to, info.messageId);
}
