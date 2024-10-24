import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(req: Request) {

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
    const body = await req.json();
    const { idform, iduser, opinion, statusapproved } = body;

    // ค้นหาข้อมูล training_form ตาม idform
    const trainingForm = await prisma.training_Form.findUnique({
      where: { id: idform },
    });

    // ตรวจสอบว่ามี training_form หรือไม่
    if (!trainingForm) {
      return new Response("ไม่พบข้อมูล Training Form", { status: 404 });
    }

    // แคสต์ฟิลด์ approver เป็นชนิดที่คาดไว้
    const approver = trainingForm.approver as Record<string, any>;
    const status = trainingForm.status as Record<string, any>;

    // ตรวจสอบว่ามี stakeholder ที่มี id ที่ระบุหรือไม่
    if (!approver[iduser]) {
      return new Response("ไม่พบข้อมูล approver", { status: 404 });
    }

    // อัปเดตค่า status ของ approver เป็น "สถานะที่ได้รับ" , เพิ่มความเห็นของผู้อนุมัติ
    approver[iduser].status = statusapproved;
    approver[iduser].opinion = opinion;

    // เพิ่มค่า approversconfirmed ขึ้น 1
    status.approversconfirmed = (status.approversconfirmed || 0) + 1;
    // อัปเดตเวลาล่าสุด
    status.latestupdate = formattedDate;

    if (
      status.approversconfirmed == status.totalapprover &&
      status.workflowsequence == 2
    ) {
      status.workflowsequence = (status.workflowsequence || 0) + 1;
    }

    if(statusapproved == "unapproved"){
      status.workflowsequence = 4
      console.log("อัปเดตสถานะของ workflowsequence 4 ", status.workflowsequence);
    }

    // อัปเดตข้อมูลในฐานข้อมูล
    await prisma.training_Form.update({
      where: { id: idform },
      data: {
        approver,
        status,
      },
    });

    return new Response(
      JSON.stringify({ message: "อัปเดตสถานะของ approver สำเร็จ" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการอัปเดตสถานะของ approver:", error);
    return new Response("เกิดข้อผิดพลาดในการอัปเดตสถานะ", {
      status: 500,
    });
  } finally {
    await prisma.$disconnect();
  }
}
