export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSlideImage } from "@/lib/images";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const imageMode  = (body.imageMode  as string) || "auto";
  const imageStyle = (body.imageStyle as string) || "educational";

  const presentation = await prisma.presentation.findUnique({
    where: { id, userId: session.user.id },
    include: { slides: { orderBy: { slideNumber: "asc" } } },
  });

  if (!presentation) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updatedSlides = [];

  for (const slide of presentation.slides) {
    if (!slide.imagePrompt || slide.slideType === "title") {
      updatedSlides.push(slide);
      continue;
    }

    const imageUrl = await getSlideImage(slide.imagePrompt, imageMode, imageStyle);

    const updated = await prisma.slide.update({
      where: { id: slide.id },
      data: { imageUrl: imageUrl ?? undefined },
    });
    updatedSlides.push(updated);
  }

  // Store image config on the presentation
  const updated = await prisma.presentation.update({
    where: { id },
    data: { animationConfig: { ...(presentation.animationConfig as object ?? {}), imageMode, imageStyle } as any },
    include: { slides: { orderBy: { slideNumber: "asc" } } },
  });

  return NextResponse.json({ presentation: updated });
}
