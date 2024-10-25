// pages/api/sendEmail.js
import { sendEmail } from "@/utils/sendEmail";
import { verificationEmailTemplate } from "@/utils/verificationEmailTemplate";

export async function POST(req: Request) {
  const { recipient, subject, recieverName, message } = await req.json();

  try {
    // ส่งอีเมล
    const messages = verificationEmailTemplate(recieverName,message);
    // Send verification email
    await sendEmail(recipient, subject, messages);
    return new Response("Email sent successfully", {
      status: 201,
    });
  } catch (error) {
    console.error("Failed to send email : 500", error);
    return new Response("Failed to send email : 500  ", {
      status: 500,
    });
  }
}