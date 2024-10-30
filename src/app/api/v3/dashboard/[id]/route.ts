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
      select: {
        requester_id: true,
        stakeholders: true,
        approver: true,
        issendrepoeted: true
      },
    });

    const requesterCount = await prisma.training_Form.count({
      where: {
        requester_id: id,
        issendrepoeted: false,  // เช็คว่ามีการรายงานหรือไม่
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
        isrepoeted: true,
        isevaluated:false  // เช็คว่ามีการประเมินหรือไม่
      },
    });

    // ตรวจสอบว่ามีฟอร์มหรือไม่
    if (!trainingForms || trainingForms.length === 0) {
      return new Response(JSON.stringify({ message: 'No training forms found' }), { status: 404 });
    }

    // คำนวณผลรวมของ notAcknowledgedCount และ approvedCount
    const totals = trainingForms.reduce(
      (acc, form) => {
        const { stakeholders, approver, requester_id } = form;

        // คำนวณจำนวนสมาชิกใน stakeholders ที่ acknowledged === false
        const notAcknowledgedCount = Object.values(stakeholders.member as Record<string, { id: string; acknowledged: boolean }>).filter(
          (stakeholder) => stakeholder.id === id && !stakeholder.acknowledged && id !== requester_id
        ).length;

        // คำนวณจำนวนสมาชิกใน approver ที่ id ตรงกับที่ได้รับมาและ approved === "approved"
        const approvedCount = Object.values(approver.member as Record<string, { id: string; approved: string }>).filter(
          (approverMember , index) => approverMember.id === id && approverMember.approved === 'pending' && stakeholders.isfullyacknowledged === true && index+1 <= approver.approvalorder
        ).length;

        // เพิ่มค่าเข้า accumulator
        acc.totalNotAcknowledged += notAcknowledgedCount;
        acc.totalApproved += approvedCount;

        return acc;
      },
      { totalNotAcknowledged: 0, totalApproved: 0,  } // ค่าเริ่มต้น
    );

    const result = {
      totalNotAcknowledged: totals.totalNotAcknowledged, //สถานะผู้มีส่วนร่วม
      totalApproved: totals.totalApproved, //สถานะอนุมัติ
      requesterCount, //สถานะคำร้อง
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
