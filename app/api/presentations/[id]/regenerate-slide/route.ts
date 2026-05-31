import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { regenerateSlide } from "@/lib/openai";
import { z } from "zod";

const schema = z.object({
  slideId: z.string(),
  instructions: z.string().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const presentation = await prisma.presentation.findFirst({
      where: { id, userId: session.user.id },
      include: { slides: { orderBy: { slideNumber: "asc" } } },
    });

    if (!presentation) {
      return NextResponse.json({ error: "Presentation not found" }, { status: 404 });
    }

    const slide = presentation.slides.find((s) => s.id === parsed.data.slideId);
    if (!slide) {
      return NextResponse.json({ error: "Slide not found" }, { status: 404 });
    }

    const context = `${presentation.title}: ${presentation.description || ""}`;
    const regenerated = await regenerateSlide(
      context,
      slide.title,
      slide.slideType,
      parsed.data.instructions
    );

    const updated = await prisma.slide.update({
      where: { id: slide.id },
      data: {
        title: regenerated.title,
        content: regenerated.content,
        speakerNotes: regenerated.speakerNotes,
        imagePrompt: regenerated.imagePrompt,
      },
    });

    return NextResponse.json({ slide: updated });
  } catch (error) {
    console.error("Regenerate slide error:", error);
    return NextResponse.json({ error: "Failed to regenerate slide" }, { status: 500 });
  }
}
