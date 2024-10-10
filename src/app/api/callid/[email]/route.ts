import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { email: string } }
) {
  return Response.json(
    await prisma.user.findUnique({
      where: { email: params.email },
      select: { id: true },
    })
  );
}
