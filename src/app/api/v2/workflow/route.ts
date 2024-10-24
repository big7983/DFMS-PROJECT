// pages/api/workflow/index.ts
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const workflows = await prisma.workFlow.findMany();
    return new Response(JSON.stringify(workflows), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching workflows:", error);
    return new Response("Error fetching workflows", { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    // Parse the request body
    const body = await req.json();
    const { id_form, nameform, approver } = body;

    // Validate the input data
    if (!id_form || !nameform || !approver) {
      return new Response("id_form, nameform, and approver are required", {
        status: 400,
      });
    }

    // Create a new WorkFlow entry
    const newWorkFlow = await prisma.workFlow.create({
      data: {
        id_form,
        nameform,
        approver: approver as Prisma.JsonObject, // Store the approver as JSON
      },
    });

    return new Response(JSON.stringify(newWorkFlow), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error creating WorkFlow:", error);
    return new Response("Error creating WorkFlow", {
      status: 500,
    });
  } finally {
    await prisma.$disconnect();
  }
}
