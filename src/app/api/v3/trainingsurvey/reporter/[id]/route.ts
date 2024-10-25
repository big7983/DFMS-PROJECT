import { sendEmail } from "@/utils/sendEmail";
import { verificationEmailTemplate } from "@/utils/verificationEmailTemplate";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function sendEvaluatorEmail(approverEmail:any, recieverName: string, course:any) {

  try {
    const message = `มีแบบฟอร์มฝึกอบรมใหม่ ${course} กำลังรอการประเมินจากคุณ.`;
    const messages = verificationEmailTemplate(recieverName, message);
    // Send verification email
    await sendEmail(
      approverEmail,
      "แจ้งเตือน : แบบประเมินการฝึกอบรมใหม่ต้องได้รับการประเมิน",
      messages
    );
  } catch (error) {
    console.error("Failed to send email : 500", error);
    return new Response("Failed to send email : 500  ", {
      status: 500,
    });
  }
}


export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // ดึงข้อมูลจาก body ที่ส่งมาจาก client
    const id  = params.id;
    const { survey } = await req.json();

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
        survey: {
          keycontent: survey.keycontent,
          matchesobjectives: survey.matchesobjectives,
          remaining: survey.remaining,
          course_result: survey.course_result,
          course_reason: survey.course_reason,
          lecturer_result: survey.lecturer_result,
          lecturer_reason: survey.lecturer_reason,
          document_result: survey.document_result,
          document_reason: survey.document_reason,
          service_result: survey.service_result,
          service_reason: survey.service_reason,
          selectedOptions: survey.selectedOptions,
        },
        isrepoeted: true,
        latestupdate: new Date().toLocaleString('th-TH', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',       
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
    });

    await sendEvaluatorEmail(trainingSurvey.evaluator.email, trainingSurvey.evaluator.name, trainingSurvey.information?.course);

    return new Response(JSON.stringify(updatedSurvey), { status: 200 });
  } catch (error) {
    console.error('Error updating survey:', error);
    return new Response(JSON.stringify({ message: 'Error updating survey', error }), { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
