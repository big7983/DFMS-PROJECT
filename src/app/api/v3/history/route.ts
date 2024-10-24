import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(req: Request) {
  try {
    const { id, name, action } = await req.json(); // ข้อมูลที่ส่งมา

    // ค้นหาโมเดลที่ตรงกับ id
    const existingModel = await prisma.training_Form.findUnique({
      where: { id: id },
      select: { history: true }, // ค้นหาข้อมูล history เดิม
    });

    if (!existingModel) {
      return new Response('Model not found', { status: 404 });
    }

    // ตรวจสอบว่า history เป็น array หรือไม่
    const currentHistory = Array.isArray(existingModel.history) ? existingModel.history : [];

    // สร้างข้อมูลใหม่สำหรับ history
    const newHistoryEntry = {
      name: name,
      action: action,
      datetime: new Date().toLocaleString('th-TH', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',       
        hour: '2-digit',
        minute: '2-digit',
      }), 
    };

    // เพิ่มข้อมูลใหม่เข้าไปใน history
    const updatedHistory = [...currentHistory, newHistoryEntry];

    // อัปเดต model โดยเพิ่มข้อมูลใหม่ลงใน history
    const updatedModel = await prisma.training_Form.update({
      where: { id: id },
      data: {
        history: updatedHistory, // บันทึก history ที่อัปเดต
      },
    });

    return new Response(JSON.stringify(updatedModel), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating history:', error);
    return new Response('Error updating history', { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
