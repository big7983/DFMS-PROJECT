import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // ดึง query parameter จาก URL
    const { searchParams } = new URL(req.url);
    const section = searchParams.get('section');

    // ตรวจสอบว่ามี section และ department ถูกส่งเข้ามาหรือไม่
    if (!section) {
      return NextResponse.json({ message: 'Section parameter is required' }, { status: 400 });
    }

    // ค้นหา Organization ที่ตรงกับ section
    const sectionhead = await prisma.organization.findFirst({
      where: { name: section },
      select: { head: true , affiliation: true }, // ดึงเฉพาะฟิลด์ head
    });

    // ค้นหา Organization ที่ตรงกับ department
    const departmenthead = await prisma.organization.findFirst({
      where: { name: sectionhead?.affiliation },
      select: { head: true }, // ดึงเฉพาะฟิลด์ head
    });

    // ตรวจสอบว่าเจอ sectionhead หรือไม่
    if (!sectionhead || !sectionhead.head) {
      return NextResponse.json({ message: 'Section or head not found' }, { status: 404 });
    }

    // ตรวจสอบว่าเจอ departmenthead หรือไม่
    if (!departmenthead || !departmenthead.head) {
      return NextResponse.json({ message: 'Department or head not found' }, { status: 404 });
    }

    // return ข้อมูลของทั้ง sectionhead และ departmenthead
    return NextResponse.json({
      sectionhead: sectionhead.head,
      departmenthead: departmenthead.head,
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching organization members:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
