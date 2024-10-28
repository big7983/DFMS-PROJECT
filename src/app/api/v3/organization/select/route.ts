import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // Use nextUrl to get search parameters without triggering dynamic behavior
    const name = req.nextUrl.searchParams.get('name');

    if (!name) {
      return NextResponse.json({ message: 'Name parameter is required' }, { status: 400 });
    }

    // Find the organization by name
    const organization = await prisma.organization.findFirst({
      where: { name },
      select: { member: true }, // Select only the member field
    });

    if (!organization || !organization.member) {
      return NextResponse.json({ message: 'Organization or members not found' }, { status: 404 });
    }

    // Convert the member object to an array and add an id field
    const membersArray = Object.values(organization.member).map((member, index) => ({
      id: index + 1, // Add an id based on index
      ...member,
    }));

    // Return the members array as JSON
    return NextResponse.json(membersArray, { status: 200 });

  } catch (error) {
    console.error('Error fetching organization members:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
