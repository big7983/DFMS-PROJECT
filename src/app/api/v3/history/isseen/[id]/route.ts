import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // ตรวจสอบว่า ID ถูกส่งเข้ามาหรือไม่
    if (!id) {
      return NextResponse.json({ message: 'กรุณาระบุ id' }, { status: 400 });
    }

    // อัปเดตฟิลด์ isseen เป็น true สำหรับ id ที่ระบุ
    const updatedRecord = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        notseen: false,
      },
    });

    return NextResponse.json({ message: 'Status updated successfully', updatedRecord }, { status: 200 });
  } catch (error) {
    console.error('Error updating status:', error);
    return NextResponse.json({ message: 'Error updating status' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
