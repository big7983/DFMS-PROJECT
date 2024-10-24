// /api/updatestatus_sth/[idform]/stakeholders/[id]/route.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(
  req: Request,
  { params }: { params: { idform: string; id: string } }
) {

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

  try {
    const { idform, id } = params;

    // ค้นหาข้อมูล training_form ตาม idform
    const trainingForm = await prisma.training_Form.findUnique({
      where: { id: idform },
    });

    // ตรวจสอบว่ามี training_form หรือไม่
    if (!trainingForm) {
      return new Response("ไม่พบข้อมูล Training Form", { status: 404 });
    }

    // แคสต์ฟิลด์ stakeholders เป็นชนิดที่คาดไว้
    const stakeholders = trainingForm.stakeholders as Record<string, any>;
    const status = trainingForm.status as Record<string, any>;

    // ตรวจสอบว่ามี stakeholder ที่มี id ที่ระบุหรือไม่
    if (!stakeholders[id]) {
      return new Response("ไม่พบข้อมูล Stakeholder", { status: 404 });
    }

    // อัปเดตค่า status ของ stakeholder เป็น "true"
    stakeholders[id].status = "true";

    // เพิ่มค่า stakeholdersconfirmed ขึ้น 1
    status.stakeholdersconfirmed = (status.stakeholdersconfirmed || 0) + 1;
    // อัปเดตเวลาล่าสุด
    status.latestupdate = formattedDate;

    if((status.stakeholdersconfirmed == status.totalstakeholders) && (status.workflowsequence == 1) ){
      status.workflowsequence = (status.workflowsequence || 0) + 1;
    }

    // อัปเดตข้อมูลในฐานข้อมูล
    await prisma.training_Form.update({
      where: { id:idform },
      data: {
        stakeholders,
        status,
      },
    });

    return new Response(
      JSON.stringify({ message: "อัปเดตสถานะของ Stakeholder สำเร็จ" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการอัปเดตสถานะของ Stakeholder:", error);
    return new Response("เกิดข้อผิดพลาดในการอัปเดตสถานะ", {
      status: 500,
    });
  } finally {
    await prisma.$disconnect();
  }
}
