export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const presentation = await prisma.presentation.findFirst({
      where: { id, userId: session.user.id },
      include: { slides: { orderBy: { slideNumber: "asc" } } },
    });

    if (!presentation) {
      return NextResponse.json({ error: "Presentation not found" }, { status: 404 });
    }

    return NextResponse.json({ presentation });
  } catch (error) {
    console.error("Fetch presentation error:", error);
    return NextResponse.json({ error: "Failed to fetch presentation" }, { status: 500 });
  }
}

const updateSlideSchema = z.object({
  slideId: z.string(),
  title: z.string().optional(),
  content: z.array(z.string()).optional(),
  speakerNotes: z.string().optional(),
});

const updatePresentationSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  theme: z.string().optional(),
  colorScheme: z.string().optional(),
  slides: z.array(updateSlideSchema).optional(),
});

export async function PATCH(
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
    const parsed = updatePresentationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const existing = await prisma.presentation.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Presentation not found" }, { status: 404 });
    }

    const { slides, ...presentationFields } = parsed.data;

    // Update presentation fields
    if (Object.keys(presentationFields).length > 0) {
      await prisma.presentation.update({
        where: { id },
        data: presentationFields,
      });
    }

    // Update individual slides
    if (slides && slides.length > 0) {
      await Promise.all(
        slides.map((slide) =>
          prisma.slide.update({
            where: { id: slide.slideId },
            data: {
              title: slide.title,
              content: slide.content,
              speakerNotes: slide.speakerNotes,
            },
          })
        )
      );
    }

    const updated = await prisma.presentation.findUnique({
      where: { id },
      include: { slides: { orderBy: { slideNumber: "asc" } } },
    });

    return NextResponse.json({ presentation: updated });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "Failed to update presentation" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const existing = await prisma.presentation.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Presentation not found" }, { status: 404 });
    }

    await prisma.presentation.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
