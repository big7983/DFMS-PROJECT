import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();



// ฟังก์ชันสำหรับสร้างข้อมูล (POST)
export async function POST(req: Request) {
  try {
    // ดึงข้อมูลจาก body ของคำขอ
    const {
      idform,
      name,
      datesubmiss,
      requester_id,
      requester,
      approver,
      information,
      survey,
      approverfeedback,
      status,
      active,
    } = await req.json();

    // สร้างข้อมูลใหม่ใน Training_Survey
    const newTrainingSurvey = await prisma.training_Survey.create({
      data: {
        idform,
        name,
        datesubmiss,
        requester_id,
        requester: requester
          ? {
              employee_id: requester.employee_id || "",
              name: requester.name || "",
              position: requester.position || "",
              rank: requester.rank || "",
              statusnoti: requester.statusnoti || "",
              textnoti: requester.textnoti || "",
            }
          : undefined,
        approver: approver ? approver : [], // กำหนด approver เป็น JSON
        information: information
          ? {
              course: information.course || "",
              location: information.location || "",
              datestart: information.datestart || "",
              dateend: information.dateend || "",
              objective: information.objective || "",
            }
          : undefined,
        survey: survey
          ? {
              keycontent: survey.keycontent || "",
              matchesobjectives: survey.matchesobjectives || "",
              remaining: survey.remaining || "",
              course_result: survey.course_result || "",
              course_reason: survey.course_reason || "",
              lecturer_result: survey.lecturer_result || "",
              lecturer_reason: survey.lecturer_reason || "",
              document_result: survey.document_result || "",
              document_reason: survey.document_reason || "",
              service_result: survey.service_result || "",
              service_reason: survey.service_reason || "",
              selectedOptions: survey.selectedOptions || [],
            }
          : undefined,
        approverfeedback: {
          objective: "",
          costEffectiveness: "",
          workBenefit: "",
          objectiveAlignment: "",
          futureRecommendation: "",
          reasonfutureRecommendation: "",
          additionalcomments: "",
        },
        status: status ? status : [], // กำหนด status เป็น JSON
        active,
      },
    });

    // ส่งข้อมูลที่สร้างกลับเป็น JSON
    return new Response(JSON.stringify(newTrainingSurvey), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error creating training survey:", error);
    return new Response("Error creating training survey", {
      status: 500,
    });
  }
}

// ฟังก์ชันสำหรับดึงข้อมูล (GET)
export async function GET() {
  try {
    // ดึงข้อมูลทั้งหมดจาก Training_Survey
    const trainingSurveys = await prisma.training_Survey.findMany();

    // ส่งข้อมูลที่ดึงมาในรูปแบบ JSON
    return new Response(JSON.stringify(trainingSurveys), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching training surveys:", error);
    return new Response("Error fetching training surveys", {
      status: 500,
    });
  }
}
