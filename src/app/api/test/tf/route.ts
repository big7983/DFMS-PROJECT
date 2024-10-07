import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const {
      idform,
      name,
      date,
      requester, // Changed from apply to requester
      stakeholders,
      information,
      budget,
      active,
    } = await req.json();

    const newTrainingForm = await prisma.training_Form.create({
      data: {
        idform,
        name,
        date,
        requester: requester
          ? {
              user_id: requester.employee_id || "",
              employee_id: requester.employee_id || "",
              name: requester.name || "",
              position: requester.position || "",
              rank: requester.rank || "",
              statusnoti: requester.statusnoti || "",
              textnoti: requester.textnoti || "",
            }
          : undefined,
        stakeholders: stakeholders ? stakeholders : [], // Ensure to handle stakeholders as an array
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
              received: budget.received,
              remaining: budget.remaining,
              registration: budget.registration,
              room: budget.room,
              transportation: budget.transportation,
              allowance: budget.allowance,
              other: budget.other,
              total: budget.total,
            }
          : undefined,
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
