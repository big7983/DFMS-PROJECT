import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // ดึง id จาก query params ที่ส่งมา
    const id = params.id;

    // ดึงหลายฟอร์มตามเงื่อนไข (สามารถเพิ่มเงื่อนไขการค้นหาได้ใน where)
    const trainingForms = await prisma.training_Form.findMany({
      where: {
        // เพิ่มเงื่อนไขอื่น ๆ เช่น active: true หากต้องการ
      },
      select: {
        stakeholders: true,
        approver: true,
        issendrepoeted: true
      },
    });

    const reporterCount = await prisma.training_Survey.count({
      where: {
        reporter_id: id,
        isrepoeted: false,  // เช็คว่ามีการรายงานหรือไม่
      },
    });

    // ค้นหา Training Survey ที่มี evaluator_id ตรงกับ id และเช็คจำนวนที่ isevaluated === true
    const evaluatorCount = await prisma.training_Survey.count({
      where: {
        evaluator_id: id,
        isevaluated: false,  // เช็คว่ามีการประเมินหรือไม่
      },
    });

    // ตรวจสอบว่ามีฟอร์มหรือไม่
    if (!trainingForms || trainingForms.length === 0) {
      return new Response(JSON.stringify({ message: 'No training forms found' }), { status: 404 });
    }

    // คำนวณผลรวมของ notAcknowledgedCount และ approvedCount
    const totals = trainingForms.reduce(
      (acc, form) => {
        const { stakeholders, approver, issendrepoeted } = form;

        // คำนวณจำนวนสมาชิกใน stakeholders ที่ acknowledged === false
        const notAcknowledgedCount = Object.values(stakeholders.member as Record<string, { id: string; acknowledged: boolean }>).filter(
          (stakeholder) => stakeholder.id === id && !stakeholder.acknowledged
        ).length;

        // คำนวณจำนวนสมาชิกใน approver ที่ id ตรงกับที่ได้รับมาและ approved === "approved"
        const approvedCount = Object.values(approver.member as Record<string, { id: string; approved: string }>).filter(
          (approverMember) => approverMember.id === id && approverMember.approved === 'pending'
        ).length;

        const isfullyapprovedCount = approver.isfullyapproved === 'pending' && issendrepoeted === false  ? 1 : 0;

        // เพิ่มค่าเข้า accumulator
        acc.totalNotAcknowledged += notAcknowledgedCount;
        acc.totalApproved += approvedCount;
        acc.totalNotFullyApproved += isfullyapprovedCount;

        return acc;
      },
      { totalNotAcknowledged: 0, totalApproved: 0, totalNotFullyApproved: 0 } // ค่าเริ่มต้น
    );

    const result = {
      totalNotAcknowledged: totals.totalNotAcknowledged,
      totalApproved: totals.totalApproved,
      totalNotFullyApproved: totals.totalNotFullyApproved,
      reporterCount, 
      evaluatorCount, 
    };

    // ส่งผลลัพธ์เป็น JSON response
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error('Error fetching training forms:', error);
    return new Response(JSON.stringify({ message: 'Error fetching training forms', error }), { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
