// http://localhost:3000/api/workflow/manage/workflow/670745729c6acd3fdd0c74f2/approver/6705eef25f0f0c6cb046b729

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(
  req: Request,
  { params }: { params: { workflowId: string; approverId: string } }
) {
  try {
    const { workflowId, approverId } = params;

    // Parse the request body to get the approver data to be updated
    const { approverData } = await req.json();

    // Fetch the current workflow data
    const existingWorkflow = await prisma.workFlow.findUnique({
      where: { id: workflowId },
    });

    if (!existingWorkflow) {
      return new Response("Workflow not found", { status: 404 });
    }

    // Parse the existing approver data
    const currentApprovers = existingWorkflow.approver as Record<string, any>;

    // Update or add the approver data
    currentApprovers[approverId] = {
      ...currentApprovers[approverId],
      ...approverData,
    };

    // Update the workflow with the new approver data
    const updatedWorkflow = await prisma.workFlow.update({
      where: { id: workflowId },
      data: {
        approver: currentApprovers,
      },
    });

    return new Response(JSON.stringify(updatedWorkflow), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error updating approver:", error);
    return new Response("Error updating approver", {
      status: 500,
    });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { workflowId: string; approverId: string } }
) {
  try {
    const { workflowId, approverId } = params;

    // Fetch the current workflow data
    const existingWorkflow = await prisma.workFlow.findUnique({
      where: { id: workflowId },
    });

    if (!existingWorkflow) {
      return new Response("Workflow not found", { status: 404 });
    }

    // Parse the existing approver data
    const currentApprovers = existingWorkflow.approver as Record<string, any>;

    // Check if the approver exists, if so, delete it
    if (currentApprovers[approverId]) {
      delete currentApprovers[approverId];
    } else {
      return new Response("Approver not found", { status: 404 });
    }

    // Update the workflow with the modified approver data
    const updatedWorkflow = await prisma.workFlow.update({
      where: { id: workflowId },
      data: {
        approver: currentApprovers,
      },
    });

    return new Response(JSON.stringify(updatedWorkflow), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error deleting approver:", error);
    return new Response("Error deleting approver", {
      status: 500,
    });
  } finally {
    await prisma.$disconnect();
  }
}
