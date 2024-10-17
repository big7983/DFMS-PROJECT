// pages/api/training-forms.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
){
  try {
    //const requesterId = "6705eef25f0f0c6cb046b729"; // Get the requester ID

    // Find all Training_Form entries where the requester's employee_id matches the specified value
    const trainingForms = await prisma.training_Form.findMany({
      where: {
        requester_id: params.id,
      },
      select: {
        status: true,
        id: true,
      },
      orderBy: {
        id: 'desc',
      },
    });

    // Map the result to extract only the desired fields and add a sequential ID
    const filteredStatus = trainingForms.map((form, index) => {
      //const idform = form.id
      const status = form.status as {
        //idform: string;
        course: string;
        datestart: string;
        namerequester: string;
        department: string;
        numstakeholders: string;
        stakeholdersconfirmed: number;
        totalstakeholders: number;
        approversconfirmed: number;
        totalapprover: number;
        workflowsequence: number;
        datereques: string;
        statusfrom: string;
        latestupdate: string;
      };

      return {
        id: index + 1,
        idform: form.id,
        course: status.course,
        datestart: status.datestart,
        namerequester: status.namerequester,
        department: status.department,
        numstakeholders: status.numstakeholders,
        stakeholdersconfirmed: status.stakeholdersconfirmed,
        totalstakeholders: status.totalstakeholders,
        approversconfirmed : status.approversconfirmed,
        totalapprover : status.totalapprover,
        workflowsequence: status.workflowsequence,
        statusfrom: status.statusfrom,
        latestupdate: status.latestupdate,
      };
    });

    return new Response(JSON.stringify(filteredStatus), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching training forms:", error);
    return new Response(error as BodyInit, {
      status: 500,
    });
  } finally {
    await prisma.$disconnect();
  }
}