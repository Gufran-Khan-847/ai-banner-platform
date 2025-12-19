import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prismaDb';

type Params = {
  id: string;
}

export async function GET(req : NextRequest, { params} : { params: Params }) {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(params.id) },
    include: { banners: true },
  });
  return NextResponse.json(user);
}

export async function PUT(req : NextRequest, { params } : { params: Params }) {
  const { email, name, company, category } = await req.json();
  const updatedUser = await prisma.user.update({
    where: { id: parseInt(params.id) },
    data: { email, name, company, category },
  });
  return NextResponse.json(updatedUser);
}

export async function DELETE(req : NextRequest, { params } : { params: Params }) {
  await prisma.user.delete({
    where: { id: parseInt(params.id) },
  });
  return NextResponse.json({ message: 'User deleted successfully' });
}

