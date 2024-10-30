import { PrismaClient } from "@prisma/client";
import { history } from "@/utils/history";
import { verificationEmailTemplate } from "@/utils/verificationEmailTemplate";
import { sendEmail } from "@/utils/sendEmail";

const prisma = new PrismaClient();

interface Stakeholder {
  id: string;
  employeeid: string;
  name: string;
  level: string;
  position: string;
  email: string;
  acknowledged: boolean;
}

async function sendNotificationEmail(
  approverEmail: any,
  recieverName: string,
  course: any
) {
  try {
    const message = `คุณได้ถูกเชิญคุณเข้าร่วมการฝึกอบรม ${course} กรุณาเข้าเว็บไซต์เพื่ออ่านรายละเอียดและรับทราบการมีส่วนร่วม`;
    const messages = verificationEmailTemplate(recieverName, message);
    // Send verification email
    await sendEmail(
      approverEmail,
      "แจ้งเตือน : เชิญคุณเข้าร่วมการฝึกอบรม",
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
    const action = `ได้เชิญคุณเข้าร่วมการฝึกอบรม ${course} กรุณาเข้าเว็บไซต์เพื่ออ่านรายละเอียดและรับทราบการมีส่วนร่วม`;

    // Send verification email
    await history(userid, nameuser, action);
  } catch (error) {
    console.error("Failed to send email : 500", error);
    return new Response("Failed to send email : 500  ", {
      status: 500,
    });
  }
}



export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Destructure required fields from the request body
    const {
      idform,
      nameform,
      datesubmiss,
      requester_id,
      requester_name,
      requester_section,
      requester_department,
      requester_position,
      stakeholders,
      approver,
      information,
      budget,
      active,
      trainingstatus,
    } = body;

    // if (!Array.isArray(stakeholders.member)) {
    //   console.error("Invalid stakeholders structure:", stakeholders.member);
    //   return new Response("Invalid stakeholders structure", { status: 400 });
    // }

    // Create a new Training_Form record
    const newTrainingForm = await prisma.training_Form.create({
      data: {
        idform,
        nameform,
        datesubmiss,
        requester_id,
        requester_name,
        requester_section,
        requester_department,
        requester_position,
        stakeholders: {
          member: stakeholders.member,
          isfullyacknowledged: stakeholders.isfullyacknowledged,
        },
        approver: {
          member: approver.member,
          approvalorder: 1,
          isfullyapproved: approver.isfullyapproved,
        },
        information: information
          ? {
              course: information.course,
              location: information.location,
              datestart: information.datestart,
              dateend: information.dateend,
              objective: information.objective,
            }
          : undefined,
        budget: budget
          ? {
              received: parseFloat(budget.received) || 0,
              remaining: parseFloat(budget.remaining) || 0,
              registration: parseFloat(budget.registration) || 0,
              room: parseFloat(budget.room) || 0,
              transportation: parseFloat(budget.transportation) || 0,
              allowance: parseFloat(budget.allowance) || 0,
              other: parseFloat(budget.other) || 0,
              total: parseFloat(budget.total) || 0,
            }
          : undefined,
        latestupdate: new Date().toLocaleString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Bangkok",
        }),
        active: active ?? true,
        trainingstatus,
      },
    });

    for (const stakeholder of Object.values(stakeholders.member) as Stakeholder[]) {
      await sendNotificationEmail(
        stakeholder.email,
        stakeholder.name,
        information.course
      );

      // Check if the stakeholder ID is different from the requester ID
      if (stakeholder.id !== requester_id) {
        await sendNotificationhistory(
          stakeholder.id,
          requester_name,
          information.course
        );
      }
    }

    return new Response(JSON.stringify(newTrainingForm), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating Training_Form:", error);
    return new Response("Error creating Training_Form", { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET() {
  try {
    const trainingForms = await prisma.training_Form.findMany(); // Fetch all training forms
    return new Response(JSON.stringify(trainingForms), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching training forms:", error); // Log the error for debugging
    return new Response("Error fetching training forms", {
      status: 500,
    });
  }
}
