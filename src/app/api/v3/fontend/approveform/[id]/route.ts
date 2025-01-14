import { PrismaClient, Training_Form } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    // ดึงข้อมูล Training_Form ทั้งหมด
    const trainingForms: Training_Form[] = await prisma.training_Form.findMany({
      where: { active: true },
      orderBy: {
        latestupdate: "desc", // เรียงลำดับจากล่าสุดเสมอ
      },
    });

    // กรองข้อมูลที่มี approver ตรงกับ id ที่กำหนด
    const filteredTrainingForms = trainingForms.filter((trainingForm) => {
      const approvalOrder = trainingForm.approver?.approvalorder; // เก็บค่า approvalorder
      return Object.values(trainingForm.approver?.member || {}).some(
        (approver: any, index) =>
          approver.id === id &&  // เช็คว่า approver.id ตรงกับ id ที่กำหนด
          index+1 <= approvalOrder  // เช็คว่า index ของ approver ตรงกับ approvalorder
      );
    });

    if (filteredTrainingForms.length === 0) {
      return new Response("Error: ไม่พบข้อมูล Training Forms", {
        status: 404,
      });
    }

    // แปลงข้อมูลที่กรองมาเป็นรูปแบบที่ต้องการ
    const responseData = filteredTrainingForms
      .filter(
        (trainingForm) =>
          trainingForm.stakeholders?.isfullyacknowledged === true
      )
      .map((trainingForm, index) => {
        const idform = trainingForm.id || "ไม่มีข้อมูล";
        const requester_name = trainingForm.requester_name || "ไม่มีข้อมูล";
        const section = trainingForm.requester_section || "ไม่มีข้อมูล";
        const course = trainingForm.information?.course || "ไม่มีข้อมูล";
        const datestart = trainingForm.information?.datestart || "ไม่มีข้อมูล";
        const dateend = trainingForm.information?.dateend || "ไม่มีข้อมูล";
        const datesubmiss = trainingForm.datesubmiss || "ไม่มีข้อมูล";
        const trainingstatus = trainingForm.trainingstatus;
        const issendrepoeted = trainingForm.issendrepoeted;
        const latestupdate = trainingForm.latestupdate;

        // คำนวณจำนวน stakeholders ทั้งหมดและที่ acknowledged เป็น true
        const stakeholders = trainingForm.stakeholders?.member || {};
        const isfullyacknowledged =
          trainingForm.stakeholders?.isfullyacknowledged ?? "ไม่มีข้อมูล";
        const totalStakeholders = Object.keys(stakeholders).length;
        const acknowledgedStakeholders = Object.values(stakeholders).filter(
          (stakeholder) => stakeholder.acknowledged === true
        ).length;

        // คำนวณจำนวน approver ทั้งหมดและที่ approved เป็น "approved"
        const approvers = trainingForm.approver?.member || {};
        const isfullyapproved =
          trainingForm.approver?.isfullyapproved ?? "ไม่มีข้อมูล";
        const totalApprovers = Object.keys(approvers).length;
        const approvedApprovers = Object.values(approvers).filter(
          (approver) => approver.approved === "approved"
        ).length;
        const foundApprover = Object.values(approvers).find(
          (approver) => approver.id === id
        );

        return {
          id: index + 1,
          idform,
          requester_name,
          section,
          course,
          datestart,
          dateend,
          datesubmiss,
          trainingstatus,
          totalStakeholders,
          acknowledgedStakeholders,
          isfullyacknowledged,
          totalApprovers,
          approvedApprovers,
          isfullyapproved,
          issendrepoeted,
          approved: foundApprover?.approved,
          latestupdate,
        };
      });

    // ส่งข้อมูลที่ต้องการกลับไป
    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response("Error fetching training forms" + error, {
      status: 500,
    });
  } finally {
    await prisma.$disconnect();
  }
}
