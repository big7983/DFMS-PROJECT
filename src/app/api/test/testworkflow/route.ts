// pages/api/users/index.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const {
      id_form,
      nameform,
      course,
      datestart,
      dateend,
      latestupdate,
      status,
      requester,
      approver,
      stakeholders,
    } = await req.json();

    const newWorkFlow = await prisma.workFlow.create({
      data: {
        id_form,
        nameform,
        course,
        datestart,
        dateend,
        latestupdate,
        status,
        requester: requester
          ? {
              user_id: requester.employee_id,
              employee_id: requester.employee_id,
              name: requester.name,
              position: requester.position,
              rank: requester.rank,
              statusnoti: requester.statusnoti,
              textnoti: requester.textnoti,
            }
          : undefined,
        approver: approver ? approver : [],
        stakeholders: stakeholders ? stakeholders : [],
      },
    });

    return Response.json(newWorkFlow);
  } catch (error) {
    return new Response(error as BodyInit, {
      status: 500,
    });
  }
}

export async function GET() {
  return Response.json(await prisma.workFlow.findMany());
}
