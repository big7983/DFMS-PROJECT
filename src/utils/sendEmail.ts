import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const sendEmail = async (
  userEmail: string,
  subject: string,
  message: string
) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST, // ใช้ host ของ Mailtrap
      port: 2525,
      // service: "gmail",
      auth: {
        user: process.env.MAIL_USER, // ใส่ User ของ Mailtrap
        pass: process.env.MAIL_PASSWORD, // ใส่ Password ของ Mailtrap
      },
    });

    const mailOptions = {
      from: process.env.SMTP_FROM_EMAIL,
      to: userEmail,
      subject,
      html: message,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    return NextResponse.json(
      {
        message: "Something went wrong" + error,
      },
      {
        status: 500,
      }
    );
  }
};
