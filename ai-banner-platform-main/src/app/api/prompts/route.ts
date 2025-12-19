import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prismaDb';

export async function GET() {
  const prompts = await prisma.prompt.findMany({
    include: { author: true, banners: true },
  });
  return NextResponse.json(prompts);
}

export async function POST(req: NextRequest) {
  const { title, description, color_pallete, theme, eg_images, authorId } = await req.json();
  const prompt = await prisma.prompt.create({
    data: { title, description, color_pallete, theme, authorId, eg_images }
  });
  return NextResponse.json(prompt);
}

