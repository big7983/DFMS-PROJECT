import { sendEmail } from "@/utils/sendEmail";
import { history } from "@/utils/history";
import { verificationEmailTemplate } from "@/utils/verificationEmailTemplate";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function sendApprovalEmail(
  approverEmail: any,
  recieverName: string,
  course: any
) {
  try {
    const message = `มีแบบฟอร์มฝึกอบรมใหม่ ${course} กำลังรอการอนุมัติจากคุณ.`;
    const messages = verificationEmailTemplate(recieverName, message);
    // Send verification email
    await sendEmail(
      approverEmail,
      "แจ้งเตือน : แบบฟอร์มการฝึกอบรมใหม่ต้องได้รับการอนุมัติ",
      messages
    );
  } catch (error) {
    console.error("Failed to send email : 500", error);
    return new Response("Failed to send email : 500  ", {
      status: 500,
    });
  }
}

async function sendNotificationhistory(
  userid: string,
  nameuser: string,
  course: any
) {
  try {
    const action = `มีแบบฟอร์มฝึกอบรมใหม่ ${course} กำลังรอการอนุมัติจากคุณ.`;

    // Send verification email
    await history(
      userid,
      nameuser,
      action
    );
  } catch (error) {
    console.error("Failed to send email : 500", error);
    return new Response("Failed to send email : 500  ", {
      status: 500,
    });
  }
}

export async function PATCH(req: Request) {

  try {
    const { id, stakeholderId } = await req.json();

    // หา Training_Form ที่ตรงกับ idform
    const trainingForm = await prisma.training_Form.findUnique({
      where: { id: id },
      select: { stakeholders: true, approver: true, information: true },
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
        latestupdate: new Date().toLocaleString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Bangkok",
        }),
      },
    });

    if (isfullyacknowledged) {
      const firstApproverID = (trainingForm.approver as any)?.member[0].id; // สมมุติว่าผู้อนุมัติคนแรกอยู่ใน index 0
      const firstApprover = (trainingForm.approver as any)?.member[0]; // สมมุติว่าผู้อนุมัติคนแรกอยู่ใน index 0
      const recieverName = (trainingForm.approver as any)?.member[0];
      if (firstApprover && firstApprover.email) {
        await sendApprovalEmail(
          firstApprover.email,
          recieverName.name,
          trainingForm.information?.course
        );
        await sendNotificationhistory(
          firstApproverID || "",
          recieverName.name,
          trainingForm.information?.course
        );
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
