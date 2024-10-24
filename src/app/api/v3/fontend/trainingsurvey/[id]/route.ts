import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const id = params.id;

  try {
    // ค้นหาข้อมูลจาก requester_id ที่ระบุ
    const trainingSurvey = await prisma.training_Survey.findMany({
      where: { reporter_id: id, active: true },
      orderBy: {
        latestupdate: "desc", // เรียงลำดับจากล่าสุดเสมอ
      },
    });

    if (!trainingSurvey || trainingSurvey.length === 0) {
      return new Response("Error: ไม่พบข้อมูล trainingSurvey", {
        status: 404,
      });
    }

    // แปลงข้อมูลที่ดึงมาเป็นรูปแบบที่ต้องการ
    const responseData = trainingSurvey.map((trainingSurvey, index) => {
      const idform = trainingSurvey.id || "ไม่มีข้อมูล";
      const requester_name = trainingSurvey.reporter.name || "ไม่มีข้อมูล";
      const course = trainingSurvey.information?.course || "ไม่มีข้อมูล";
      const datestart = trainingSurvey.information?.datestart || "ไม่มีข้อมูล";
      const dateend = trainingSurvey.information?.dateend || "ไม่มีข้อมูล";
      const evaluator_name = trainingSurvey.evaluator.name || "ไม่มีข้อมูล";
      const isrepoeted = trainingSurvey.isrepoeted;
      const isevaluated = trainingSurvey.isevaluated;
      const latestupdate = trainingSurvey.latestupdate;

      return {
        id: index + 1,
        idform,
        requester_name,
        course,
        datestart,
        dateend,
        evaluator_name,
        isevaluated,
        isrepoeted,
        latestupdate,
      };
    });

    // ส่งข้อมูลที่ต้องการกลับไป
    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response("Error fetching training forms"+error, {
      status: 500,
    });
  } finally {
    await prisma.$disconnect();
  }
}
