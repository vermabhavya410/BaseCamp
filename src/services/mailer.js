import 'dotenv/config';
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async ({ userEmail, subject, html }) => {
  try {
    const response = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: userEmail,
      subject,
      html
    })
    return response
  } catch (error) {
    console.log(error, "error sending mail");
    throw error
  }
}