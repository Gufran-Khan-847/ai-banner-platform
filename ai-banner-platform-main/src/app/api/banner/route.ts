import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prismaDb';
import { Prompt } from '@/app/api/api.types';

export async function GET() {
  const banners = await prisma.banner.findMany({
    include: { author: true, prompt: true },
  });
  return NextResponse.json(banners);
}


export async function POST(req: NextRequest) {
  const { title, description, link, authorId, promptId } = await req.json();
  const banner = await prisma.banner.create({
    data: { id: 0, title, description, link, authorId, promptId },
  });
  return NextResponse.json(banner);
}

