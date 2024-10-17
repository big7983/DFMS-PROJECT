// pages/api/training-forms-status.ts
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const approverId = params.id;

    const trainingForms = await prisma.training_Form.findMany({
      select: {
        status: true,
        datesubmiss: true,
        approver: true, 
        id: true,
      },
      orderBy: {
        id: 'desc',
      },
    });
    
    let numform = 0;

    const filteredForms = trainingForms
      .map((form, index) => {

        const approver = form.approver as Prisma.JsonObject;
        const approverData = approver[approverId] as Prisma.JsonObject | undefined;
        const status = form.status as Prisma.JsonObject;

        if (approverData && ((status.workflowsequence != 1) )) {  
          numform += 1;
          return {
            id: numform,
            idform: form.id,
            datesubmiss: form.datesubmiss,
            course: status.course,
            datestart: status.datestart,
            namerequester: status.namerequester,
            department: status.department,
            stakeholdersconfirmed: status.stakeholdersconfirmed,
            totalstakeholders: status.totalstakeholders,
            approversconfirmed : status.approversconfirmed,
            totalapprover : status.totalapprover,
            datereques: status.datereques,
            workflowsequence: status.workflowsequence,
            //statuslist: stakeholderData.status,
            latestupdate: status.latestupdate,
          };
        }
        return null;
      })
      .filter(Boolean); 

    return new Response(JSON.stringify(filteredForms), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching training forms:", error);
    return new Response("Error fetching training forms", {
      status: 500,
    });
  } finally {
    await prisma.$disconnect();
  }
}
