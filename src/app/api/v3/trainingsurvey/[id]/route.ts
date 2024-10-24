import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  return Response.json(
    await prisma.training_Survey.findMany({
      where: { id: params.id },
    })
  );
}