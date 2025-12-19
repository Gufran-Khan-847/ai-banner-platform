import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prismaDb';

export async function GET() {
  const users = await prisma.user.findMany({
    include: { banners: true },
  });
  return NextResponse.json(users);
}

export async function POST(req : NextRequest) {
  const { email, name, company, category } = await req.json();
  const user = await prisma.user.create({
    data: { email, name, company, category, api_key: '', monthly_tokens: 0 },
  });
  return NextResponse.json(user);
}

