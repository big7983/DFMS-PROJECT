import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // ดึงข้อมูลจาก body ที่ส่งมาจาก client
    const id  = params.id;
    const { evaluatorfeedback } = await req.json();

    // ค้นหา Training Survey ตาม ID ที่ส่งเข้ามา
    const trainingSurvey = await prisma.training_Survey.findUnique({
      where: { id },
    });

    if (!trainingSurvey) {
      return new Response(JSON.stringify({ message: 'Training Survey not found' }), { status: 404 });
    }

    // อัปเดตข้อมูลในส่วนของ survey และเปลี่ยน isrepoeted เป็น true
    const updatedSurvey = await prisma.training_Survey.update({
      where: { id },
      data: {
        evaluatorfeedback: {
          objective: evaluatorfeedback.objective,
          costEffectiveness: evaluatorfeedback.costEffectiveness,
          workBenefit: evaluatorfeedback.workBenefit,
          objectiveAlignment: evaluatorfeedback.objectiveAlignment,
          futureRecommendation: evaluatorfeedback.futureRecommendation,
          reasonfutureRecommendation: evaluatorfeedback.reasonfutureRecommendation,
          additionalcomments: evaluatorfeedback.additionalcomments,
        },
        isevaluated: true,
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

    return new Response(JSON.stringify(updatedSurvey), { status: 200 });
  } catch (error) {
    console.error('Error updating survey:', error);
    return new Response(JSON.stringify({ message: 'Error updating survey', error }), { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
