import { PrismaClient } from '@prisma/client';
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

async function sendNotificationEmail(approverEmail:any, course:any) {
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
    const { id, approverId, opinion, statusapproved } = await req.json();
    const trainingForm = await prisma.training_Form.findFirst({
      where: { id:id },
      select: {
        approver: true,
        information: true,
      },
    });

    if (!trainingForm) {
      return new Response('Training Form not found', { status: 404 });
    }

    // ค้นหา stakeholder ตาม id
    const approver = trainingForm.approver;
    const member = approver.member as any;

    const updatedMember = Object.keys(member).reduce((acc, key) => {
      const approver = member[key];
      if (approver.id === approverId) {
        approver.approved = statusapproved; 
        approver.opinion = opinion;
      }
      acc[key] = approver;
      return acc;
    }, {} as Record<string, any>);

    let isfullyapproved: string;

    if (Object.values(updatedMember).every((app: { approved: string }) => app.approved === 'approved')) {
      isfullyapproved = 'fullyapproved';
    } else if (Object.values(updatedMember).some((app: { approved: string }) => app.approved === 'unapproved')) {
      isfullyapproved = 'unapproved';
    } else {
      isfullyapproved = 'pending';
    }

    const updatedApprover = await prisma.training_Form.update({
      where: { id:id },
      data: {
        approver: {
          member: updatedMember,
          isfullyapproved: isfullyapproved,
          approvalorder: trainingForm.approver.approvalorder+1
        },
        latestupdate: formattedDate, 
      },
    });

    if (statusapproved === 'approved') {
      const nextApprover = (trainingForm.approver as any)?.member[approver.approvalorder];
      if (nextApprover && nextApprover.email) {
        await sendNotificationEmail(nextApprover.email, trainingForm.information?.course);
      }
    }

    return new Response(JSON.stringify(updatedApprover), { status: 200 });
  } catch (error) {
    console.error('Error updating approver:', error);
    return new Response('Error updating approver'+error, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
