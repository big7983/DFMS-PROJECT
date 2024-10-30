import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {

    const name = req.nextUrl.searchParams.get('name');

    if (!name) {
      return NextResponse.json({ message: 'Name parameter is required' }, { status: 400 });
    }

    const organization = await prisma.organization.findFirst({
      where: { name },
      select: { member: true },
    });

    if (!organization || !organization.member) {
      return NextResponse.json({ message: 'Organization or members not found' }, { status: 404 });
    }

    const membersArray = Object.values(organization.member).map((member, index) => ({
      id: index + 1,
      ...member,
    }));

    return NextResponse.json(membersArray, { status: 200 });

  } catch (error) {
    console.error('Error fetching organization members:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
