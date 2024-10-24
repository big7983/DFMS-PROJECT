import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

async function sendApprovalEmail(approverEmail:any, course:any) {
  // สร้าง transporter
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST, // ใช้ host ของ Mailtrap
    port: 2525,
    // service: "gmail",
    auth: {
      user: process.env.MAIL_USER, // ใส่ User ของ Mailtrap
      pass: process.env.MAIL_PASSWORD, // ใส่ Password ของ Mailtrap
    },
  });

  // สร้างข้อความ
  const mailOptions = {
    from: ' <your_email@example.com>', // ส่งจากอีเมลของคุณ
    to: approverEmail, // ส่งถึงอีเมลของผู้อนุมัติ
    subject: "แบบฟอร์มการฝึกอบรมใหม่ต้องได้รับการอนุมัติ",
    text: `มีแบบฟอร์มฝึกอบรมใหม่ ${course} กำลังรอการอนุมัติจากคุณ.`,
  };

  // ส่งอีเมล
  await transporter.sendMail(mailOptions);
}

export async function PATCH(req: Request) {
  const date = new Date();
  const locale = "en-GB";
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  const formattedDate = formatter.format(date);

  try {
    const { id, stakeholderId } = await req.json();

    // หา Training_Form ที่ตรงกับ idform
    const trainingForm = await prisma.training_Form.findUnique({
      where: { id: id },
      select: { stakeholders: true, approver: true, information:true },
    });

    if (!trainingForm) {
      return new Response("Training Form not found", { status: 404 });
    }

    // ค้นหา stakeholder ตาม id
    const stakeholders = trainingForm.stakeholders;
    const member = stakeholders.member as any;

    const updatedMember = Object.keys(member).reduce((acc, key) => {
      const stakeholder = member[key];
      if (stakeholder.id === stakeholderId) {
        stakeholder.acknowledged = true; // อัปเดต acknowledged เป็น true
      }
      acc[key] = stakeholder;
      return acc;
    }, {} as Record<string, any>);

    // ตรวจสอบว่า stakeholder acknowledged เป็น true ครบทุกคนยัง
    const isfullyacknowledged = Object.values(updatedMember).every(
      (stakeholder) => stakeholder.acknowledged === true
    );

    // อัปเดต Training_Form
    const updatedTrainingForm = await prisma.training_Form.update({
      where: { id: id },
      data: {
        stakeholders: {
          member: updatedMember,
          isfullyacknowledged: isfullyacknowledged,
        },
        latestupdate: formattedDate,
      },
    });

    if (isfullyacknowledged) {
      const firstApprover = (trainingForm.approver as any)?.member[0]; // สมมุติว่าผู้อนุมัติคนแรกอยู่ใน index 0
      if (firstApprover && firstApprover.email) {
        await sendApprovalEmail(firstApprover.email, trainingForm.information?.course);
      }
    }

    return new Response(JSON.stringify(updatedTrainingForm), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating stakeholder:", error);
    return new Response("Error updating stakeholder", { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
