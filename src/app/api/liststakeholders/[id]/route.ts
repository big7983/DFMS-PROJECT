// pages/api/training-forms-status.ts
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const stakeholderId = params.id; // Get the stakeholder ID

    // Fetch all Training_Form entries
    const trainingForms = await prisma.training_Form.findMany({
      select: {
        status: true,
        stakeholders: true, 
        id: true,
      },
    });

    // Filter out entries that contain the stakeholder ID in their stakeholders object
    const filteredForms = trainingForms
      .map((form, index) => {
        // Typecast stakeholders as a JsonObject to safely access properties
        const stakeholders = form.stakeholders as Prisma.JsonObject;

        // Check if stakeholders is not null and contains the desired stakeholderId
        const stakeholderData = stakeholders[stakeholderId] as Prisma.JsonObject | undefined;

        // If the stakeholder data exists, format the response
        if (stakeholderData) {
          const status = form.status as Prisma.JsonObject;
          return {
            id: index+1,
            idform: form.id,
            course: status.course,
            datestart: status.datestart,
            namerequester: status.namerequester,
            department: status.department,
            numstakeholders: status.numstakeholders,
            datereques: status.datereques,
            statusfrom: status.statusfrom,
            statuslist: stakeholderData.status,
            latestupdate: status.latestupdate,
          };
        }
        return null;
      })
      .filter(Boolean); // Remove null entries

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
