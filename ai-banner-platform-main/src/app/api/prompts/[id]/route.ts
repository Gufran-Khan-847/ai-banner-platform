import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prismaDb';

type Params = {
  id: string;
}

export async function GET(req: NextRequest, { params } : { params: Params }) {
  const prompt = await prisma.prompt.findUnique({
    where: { id: parseInt(params.id) },
    include: { author: true, banners: true },
  });
  return NextResponse.json(prompt);
}

export async function PUT(req: NextRequest, { params } : { params: Params }) {
  const { title, description, color_pallete, theme, eg_images } = await req.json();
  const updatedPrompt = await prisma.prompt.update({
    where: { id: parseInt(params.id) },
    data: { title, description, color_pallete, theme, eg_images },
  });
  return NextResponse.json(updatedPrompt);
}

export async function DELETE(req: NextRequest, { params } : { params: Params }) {
  await prisma.prompt.delete({
    where: { id: parseInt(params.id) },
  });
  return NextResponse.json({ message: 'Prompt deleted successfully' });
}
