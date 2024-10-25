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
    const newPost = await prisma.user.create({
      data: {
        email,
        name,
        level,
        position,
        employee_id,
        section,
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
