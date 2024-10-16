import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

export async function PATCH(req: Request) {
  const { id, userid, feedback } = await req.json(); // รับข้อมูลจาก body

  try {
    const survey = await prisma.training_Survey.findUnique({
      where: { id: id },
    });

    if (!survey) {
      return new Response(JSON.stringify({ error: "Survey not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // แปลง approver เป็น object เพื่อให้สามารถแก้ไขได้
    const approver = survey.approver as Record<string, any> || {};
    const status = survey.status as Record<string, any> || {};


    // ตรวจสอบว่า userid มีอยู่ใน approver หรือไม่
    if (!approver[userid]) {
      return new Response(JSON.stringify({ error: "User not found in approver list" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // อัปเดตสถานะของ userid เป็น "approved"
    approver[userid].status = "approved";
    status.workflow = "approved";
    status.latestupdate = formattedDate;

    // อัปเดตข้อมูลใน Prisma
    const updatedFeedback = await prisma.training_Survey.update({
      where: { id: id },
      data: {
        status: status,
        approver: approver,
        approverfeedback: {
          objective: feedback.objective,
          costEffectiveness: feedback.costEffectiveness,
          workBenefit: feedback.workBenefit,
          objectiveAlignment: feedback.objectiveAlignment,
          futureRecommendation: feedback.futureRecommendation,
          reasonfutureRecommendation: feedback.reasonfutureRecommendation,
          additionalcomments: feedback.additionalcomments,
        },
      },
    });

    return new Response(JSON.stringify(updatedFeedback), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Could not update feedback" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
