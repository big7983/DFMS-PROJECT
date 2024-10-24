// api/v2/sendmail
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const { recipient, subject, message } = await req.json();

  // สร้าง transporter สำหรับการเชื่อมต่อกับ Mailtrap
  let transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST, // ใช้ host ของ Mailtrap
    port: 2525,
    auth: {
      user: process.env.MAIL_USER, // ใส่ User ของ Mailtrap
      pass: process.env.MAIL_PASSWORD, // ใส่ Password ของ Mailtrap
    },
  });

  // สร้างเนื้อหาของอีเมลในรูปแบบ HTML
  const htmlContent = `
    <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Email Template</title>
    <style>
        /* กำหนดสไตล์ CSS ที่นี่ */
        body {
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;   

        }
        .header   
 {
            text-align: center;
            padding: 20px;
        }
        .content {
            padding: 20px;
        }
        .button {
            background-color: #4CAF50; /* สีเขียว */
            border: none;
            color: white;
            padding: 15px 32px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            margin: 4px 2px;
            cursor: pointer;   

        }
    </style>
</head>
<body>
    <div class="container">
        <div   
 class="header">
            <h1>หัวข้ออีเมล</h1>
        </div>
        <div class="content">
            <p>เนื้อหาของอีเมล</p>
            <a href="#" class="button">คลิกที่นี่</a>
        </div>
    </div>
</body>
</html>
  `;

  try {
    // ส่งอีเมล
    await transporter.sendMail({
      from: "setthawutk@ssi-steel.com", // ผู้ส่ง
      to: recipient, // ผู้รับ
      subject: subject, // หัวข้ออีเมล
      text: message, // ข้อความในอีเมล (กรณีเป็นข้อความล้วน)
      html: htmlContent, // ข้อความในรูปแบบ HTML
    });

    return new Response("Email sent successfully", {
      status: 201,
    });
  } catch (error) {
    console.error("Failed to send email:", error);
    return new Response("Failed to send email", {
      status: 500,
    });
  }
}
