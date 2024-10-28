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
    const history = await prisma.user.findUnique({
      where:{id:iduser},
      select: {
        history: true,
        notseen:true
      },
    });
    
    return NextResponse.json(history, { status: 200 });
  } catch (error) {
    console.error('Error fetching user history:', error);
    return NextResponse.json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
