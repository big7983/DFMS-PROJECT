import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const {
      idform,
      name,
      datesubmiss,
      requester_id,
      requester, 
      stakeholders,
      approver,
      information,
      budget,
      status,
      active,
    } = await req.json();

    const newTrainingForm = await prisma.training_Form.create({
      data: {
        idform,
        name,
        datesubmiss,
        requester_id,
        requester: requester
          ? {
              employee_id: requester.employee_id || "",
              name: requester.name || "",
              position: requester.position || "",
              rank: requester.rank || "",
              statusnoti: requester.statusnoti || "",
              textnoti: requester.textnoti || "",
            }
          : undefined,
        stakeholders: stakeholders ? stakeholders : [],
        approver: approver? approver : [],
        information: information
          ? {
              course: information.course,
              location: information.location,
              datestart: information.datestart,
              dateend: information.dateend,
              objective: information.objective,
            }
          : undefined,
        budget: budget
          ? {
              received: parseFloat(budget.received) || 0,
              remaining: parseFloat(budget.remaining) || 0,
              registration: parseFloat(budget.registration) || 0,
              room: parseFloat(budget.room) || 0,
              transportation: parseFloat(budget.transportation) || 0,
              allowance: parseFloat(budget.allowance) || 0,
              other: parseFloat(budget.other) || 0,
              total: parseFloat(budget.total) || 0,
            }
          : undefined,
        status: status ? status : [],
        active,
      },
    });

    return new Response(JSON.stringify(newTrainingForm), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error creating training form:", error); // Log the error for debugging
    return new Response("Error creating training form", {
      status: 500,
    });
  }
}

export async function GET(req: Request) {
  try {
    const trainingForms = await prisma.training_Form.findMany(); // Fetch all training forms
    return new Response(JSON.stringify(trainingForms), {
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
