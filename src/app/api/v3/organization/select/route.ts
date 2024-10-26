import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request,) {
  try {
    // ดึง query parameter จาก URL
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name');

    if (!name) {
      return new Response(JSON.stringify({ message: 'Name parameter is required' }), { status: 400 });
    }

    // ค้นหา Organization ที่ตรงกับชื่อที่รับมา
    const organization = await prisma.organization.findFirst({
      where: { name: name },
      select: { member: true }, // ดึงเฉพาะฟิลด์ member
    });

    if (!organization || !organization.member) {
      return new Response(JSON.stringify({ message: 'Organization or members not found' }), { status: 404 });
    }

    // แปลง object ของสมาชิกเป็น array
    const membersArray = Object.values(organization.member).map((member, index) => ({
      id: index + 1, // เพิ่ม index เป็น id
      ...member, // กระจายข้อมูลของสมาชิก
    }));

    // ส่งข้อมูล members กลับไป
    return new Response(JSON.stringify(membersArray), { status: 200 });

  } catch (error) {
    console.error('Error fetching organization members:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
