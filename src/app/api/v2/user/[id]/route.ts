import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // ดึงข้อมูลจาก body ของคำขอ
    const { name, level, position, employee_id , department, role } = await req.json();

    // อัปเดตข้อมูลของผู้ใช้ตาม employee_id
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: {  name, level, position, employee_id , department, role },
    });

    // ส่งข้อมูลที่อัปเดตกลับเป็น JSON
    return new Response(JSON.stringify(updatedUser), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // ลบข้อมูลผู้ใช้ตาม id
    await prisma.user.delete({
      where: { id: params.id },
    });

    // ส่งข้อความยืนยันการลบกลับไป
    return new Response(
      JSON.stringify({ message: 'User deleted successfully' }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error deleting user:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  } finally {
    await prisma.$disconnect();
  }
}