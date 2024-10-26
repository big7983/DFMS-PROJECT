import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request,) {
  try {
    // ดึง query parameter จาก URL
    const { searchParams } = new URL(req.url);
    const section = searchParams.get('section');

    // ตรวจสอบว่ามี section ถูกส่งเข้ามาหรือไม่
    if (!section) {
      return new Response(JSON.stringify({ message: 'Section parameter is required' }), { status: 400 });
    }

    // ค้นหา Organization ที่ตรงกับ section
    const sectionhead = await prisma.organization.findFirst({
      where: { name: section },
      select: { head: true, affiliation: true }, // ดึงเฉพาะฟิลด์ head และ affiliation
    });

    // ตรวจสอบว่าเจอ sectionhead หรือไม่
    if (!sectionhead || !sectionhead.head) {
      return new Response(JSON.stringify({ message: 'Section or head not found' }), { status: 404 });
    }

    // ค้นหา Organization ที่ตรงกับ department
    const departmenthead = await prisma.organization.findFirst({
      where: { name: sectionhead.affiliation }, // ใช้ affiliation เพื่อค้นหา department
      select: { head: true }, // ดึงเฉพาะฟิลด์ head
    });

    // ตรวจสอบว่าเจอ departmenthead หรือไม่
    if (!departmenthead || !departmenthead.head) {
      return new Response(JSON.stringify({ message: 'Department or head not found' }), { status: 404 });
    }

    // return ข้อมูลของทั้ง sectionhead และ departmenthead
    return new Response(
      JSON.stringify({
        sectionhead: sectionhead.head,
        departmenthead: departmenthead.head,
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error('Error fetching organization members:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}