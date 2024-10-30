import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const users = await prisma.user.findMany(); // Fetch all training forms
    return new Response(JSON.stringify(users), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching training forms:", error); // Log the error for debugging
    return new Response("Error fetching training forms", {
      status: 500,
    });
  }
}

export async function POST(req: Request) {
  try {
    const { email, name, level, position, employee_id, section, department, role } = await req.json();

    // สร้างผู้ใช้ใหม่
    const newUser = await prisma.user.create({ 
      data: { email, name, level, position, employee_id, section, department, role, history:[] },
    });

    // หา group โดยใช้ชื่อ
    const group = await prisma.organization.findUnique({
      where: { name: section },
    });

    if (!group) {
      return new Response(JSON.stringify({ message: 'Group not found' }), { status: 404 });
    }

    // อัพเดตสมาชิกใหม่ลงใน member array
    const updatedMembers = { 
      ...(group.member as Record<string, any>), // แปลง member ให้เป็น object type
      [Object.keys(group.member as Record<string, any>).length]: {
        name: newUser.name,
        position: newUser.position,
        email: newUser.email,
        employeeid: newUser.employee_id,
        level: newUser.level,
        userid: newUser.id
      }
    };

    // อัพเดตข้อมูลในฐานข้อมูล
    const updatedGroup = await prisma.organization.update({
      where: { name: section },
      data: { member: updatedMembers },
    });

    return new Response(JSON.stringify(updatedGroup), { status: 200 });
  } catch (error) {
    return new Response("Error fetching newuser "+error, {
      status: 500,
    });
  }
}

