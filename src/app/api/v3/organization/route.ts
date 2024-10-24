import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const organizations = await prisma.organization.findMany();

    return new Response(JSON.stringify(organizations), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching organizations:", error);
    return new Response("Error fetching organizations", {
      status: 500,
    });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, head, members, affiliation } = body;

    // สร้างข้อมูลใหม่ใน Organization
    const newOrganization = await prisma.organization.create({
      data: {
        name,
        head: {
          name: head.name,
          position: head.position,
          email: head.email,
          employeeid: head.employeeid,
          level: head.level,
          userid: head.userid,
        },
        member: members.map((member: any) => ({
          name: member.name,
          position: member.position,
          email: member.email,
          employeeid: member.employeeid,
          level: member.level,
          userid: member.userid,
        })),
        affiliation,
      },
    });

    return new Response(JSON.stringify(newOrganization), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error creating organization:", error);
    return new Response("Error creating organization", {
      status: 500,
    });
  } finally {
    await prisma.$disconnect();
  }
}
