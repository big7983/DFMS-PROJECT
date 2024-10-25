import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {

  const date = new Date();
  const locale = "en-GB";
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  const formattedDate = formatter.format(date);

  try {
    const body = await req.json();
    
    // Destructure required fields from the request body
    const {
      idform,
      nameform,
      datesubmiss,
      requester_id,
      requester_name,
      requester_section,
      requester_department,
      requester_position,
      stakeholders,
      approver,
      information,
      budget,
      active,
      trainingstatus,
    } = body;

    // Create a new Training_Form record
    const newTrainingForm = await prisma.training_Form.create({
      data: {
        idform,
        nameform,
        datesubmiss,
        requester_id,
        requester_name,
        requester_section,
        requester_department,
        requester_position,
        stakeholders: {
          member: stakeholders.member,
          isfullyacknowledged: stakeholders.isfullyacknowledged,
        },
        approver:  {
              member: approver.member,
              approvalorder: 1,
              isfullyapproved: approver.isfullyapproved,
        },
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
        latestupdate:formattedDate,
        active: active ?? true,
        trainingstatus,
        history:[
  
          {name:requester_name,
          action: "สร้างคำร้องแบบอนุมัติอบรม"+information.course,
          datetime:new Date().toLocaleString('th-TH', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',       
            hour: '2-digit',
            minute: '2-digit',
          })}  
          
        ]   
        
      },
    });

    return new Response(JSON.stringify(newTrainingForm), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating Training_Form:', error);
    return new Response('Error creating Training_Form', { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET() {
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
