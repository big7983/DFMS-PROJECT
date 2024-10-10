import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  return Response.json(await prisma.user.findMany());
}

export async function POST(req: Request) {
  try {
    const { email, name, rank, position, employee_id, department, role } = await req.json();
    const newPost = await prisma.user.create({
      data: {
        email,
        name,
        rank,
        position,
        employee_id,
        department,
        role,
      },
    });
    return Response.json(newPost);
  } catch (error) {
    return new Response(error as BodyInit, {
      status: 500,
    });
  }
}
