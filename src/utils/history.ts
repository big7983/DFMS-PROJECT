import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const history = async (
    userid: string,
    nameuser: string,
    action: string
  ) => {
  try {

    // ค้นหาโมเดลที่ตรงกับ id
    const existingModel = await prisma.user.findUnique({
      where: { id: userid },
      select: { history: true }, // ค้นหาข้อมูล history เดิม
    });

    if (!existingModel) {
      return new Response("Model not found", { status: 404 });
    }

    // ตรวจสอบว่า history เป็น array หรือไม่
    const currentHistory = Array.isArray(existingModel.history)
      ? existingModel.history
      : [];
   

    // สร้างข้อมูลใหม่สำหรับ history
    const newHistoryEntry = {
      name: nameuser,
      action: action,
      datetime: new Date().toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    // เพิ่มข้อมูลใหม่เข้าไปใน history
    const updatedHistory = [...currentHistory, newHistoryEntry];

    const updatedModel = await prisma.user.update({
      where: { id: userid },
      data: {
        history: updatedHistory,
        notseen:true
      },
    });

    return new Response(JSON.stringify(updatedModel), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating history:", error);
    return new Response("Error updating history", { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
