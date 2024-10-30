import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      trainingform_id,
      reporter_id,
      reporter_name,
      reporter_level,
      reporter_position,
      reporter_email,
    } = body;

    // ค้นหาข้อมูล Training_Form ที่ต้องการ
    const trainingForm = await prisma.training_Form.findFirst({
      where: { id: trainingform_id, active: true },
      select: {
        stakeholders: true,
        information: true,
        requester_section: true,
      },
    });

    if (!trainingForm) {
      return new Response("Error: ไม่พบข้อมูล Training Form", { status: 404 });
    }

    await prisma.training_Form.update({
      where: { id: trainingform_id, active: true },
      data: {
        issendrepoeted: true,
      },
    });
    
    const requesterSectionName = trainingForm.requester_section || undefined;

    const section = await prisma.organization.findFirst({
      where: { name: requesterSectionName },
    });

    // สร้างข้อมูลใหม่ใน Training_Survey
    if (trainingForm && section) {
      const newTrainingSurvey = await prisma.training_Survey.create({
        data: {
          idform: "T002",
          nameform: "รายงานผลการฝึกอบรม",
          trainingform_id: trainingform_id || null, // ใส่ null ถ้าไม่มีค่า
          datesubmiss: "",
          information: {
            course: trainingForm.information?.course || "ไม่มีข้อมูล",
            location: trainingForm.information?.location || "ไม่มีข้อมูล",
            datestart: trainingForm.information?.datestart || "ไม่มีข้อมูล",
            dateend: trainingForm.information?.dateend || "ไม่มีข้อมูล",
            objective: trainingForm.information?.objective || "ไม่มีข้อมูล",
          },
          survey: {
            keycontent: " ",
            matchesobjectives: " ",
            remaining: " ",
            course_result: " ",
            course_reason: " ",
            lecturer_result: " ",
            lecturer_reason: " ",
            document_result: " ",
            document_reason: " ",
            service_result: " ",
            service_reason: " ",
            selectedOptions: [],
          },
          evaluatorfeedback: {
            objective: " ",
            costEffectiveness: " ",
            workBenefit: " ",
            objectiveAlignment: " ",
            futureRecommendation: " ",
            reasonfutureRecommendation: " ",
            additionalcomments: " ",
          },
          evaluationstatus: "รอประเมิน",
          latestupdate: new Date().toLocaleString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Asia/Bangkok",
          }),
          reporter_id: reporter_id,
          reporter: {
            name: reporter_name,
            level: reporter_level,
            position: reporter_position,
            email: reporter_email,
          },
          evaluator_id: (section.head as any)?.userid || "ไม่มีข้อมูล",
          evaluator: {
            name: (section.head as any)?.name || "ไม่มีข้อมูล",
            level: (section.head as any)?.level || "ไม่มีข้อมูล",
            position: (section.head as any)?.position || "ไม่มีข้อมูล",
            email: (section.head as any)?.email || "ไม่มีข้อมูล",
          },
          section: section.name,
          department: section.affiliation,
        },
      });

      // ส่งข้อมูลที่สร้างเสร็จกลับไป
      return new Response(JSON.stringify(newTrainingSurvey), {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      return new Response("Error dsfdsf training survey", {
        status: 404,
      });
    }
  } catch (error) {
    console.error("Error creating training survey:", error);
    return new Response("Error creating training survey" + error, {
      status: 500,
    });
  } finally {
    await prisma.$disconnect();
  }
}
