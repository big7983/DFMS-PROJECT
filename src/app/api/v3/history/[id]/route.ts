import {  NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const iduser = params.id;

    if (!iduser) {
      return NextResponse.json({ message: 'กรุณาระบุ iduser' }, { status: 400 });
    }

    // ดึงข้อมูลฟอร์มทั้งหมด
    const forms = await prisma.training_Form.findMany({
      select: {
        history: true, // ดึงเฉพาะ history
        requester_id: true, // ดึง requester_id ด้วย
        approver: true, // ดึงข้อมูล approver
        stakeholders: true, // ดึงข้อมูล stakeholders
      },
    });

    // กรองข้อมูลฟอร์มในฝั่ง JavaScript
    const filteredForms = forms.filter((form) => {
      // ตรวจสอบว่า requester_id ตรงกับ iduser หรือไม่
      if (form.requester_id === iduser) {
        return true;
      }

      // ตรวจสอบว่า approver.member เป็นอาร์เรย์และมี iduser หรือไม่
      let approverHasId = false;
      if (Array.isArray(form.approver?.member)) {
        approverHasId = form.approver.member.some((member:any) => member.id === iduser);
      }

      // ตรวจสอบว่า stakeholders.member เป็นอาร์เรย์และมี iduser หรือไม่
      let stakeholderHasId = false;
      if (Array.isArray(form.stakeholders?.member)) {
        stakeholderHasId = form.stakeholders.member.some((member:any) => member.id === iduser);
      }

      // คืนค่า true ถ้าพบ iduser ใน requester, approver, หรือ stakeholders
      return approverHasId || stakeholderHasId;
    });

    if (filteredForms.length === 0) {
      return NextResponse.json({ message: 'ไม่พบข้อมูล history ของผู้ใช้' }, { status: 404 });
    }

    // ส่งเฉพาะข้อมูล history ของฟอร์มที่ผ่านการกรองแล้วกลับมา
    const historyResults = filteredForms.flatMap(form => form.history);
    
    return NextResponse.json(historyResults, { status: 200 });
  } catch (error) {
    console.error('Error fetching user history:', error);
    return NextResponse.json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
