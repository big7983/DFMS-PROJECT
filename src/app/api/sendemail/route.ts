// pages/api/sendEmail.js
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const { recipient, subject, message } = await req.json();

  // สร้าง transporter สำหรับการเชื่อมต่อกับ Mailtrap
  let transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST, // ใช้ host ของ Mailtrap
    port: 2525,
    // service: "gmail",
    auth: {
      user: process.env.MAIL_USER, // ใส่ User ของ Mailtrap
      pass: process.env.MAIL_PASSWORD, // ใส่ Password ของ Mailtrap
    },
  });

  try {
    // ส่งอีเมล
    await transporter.sendMail({
      from: 'setthawutk@ssi-steel.com', // ผู้ส่ง
      to: recipient, // ผู้รับ
      subject: subject, // หัวข้ออีเมล
      text: message, // ข้อความในอีเมล (กรณีเป็นข้อความล้วน)
      html: `<p>${message}</p>`, // ข้อความในรูปแบบ HTML
    });

    return new Response("Email sent successfully", {
      status: 201,
    });
  } catch (error) {
    console.error("Failed to send email : 500", error);
    return new Response("Failed to send email : 500  ", {
      status: 500,
    });
  }
}
