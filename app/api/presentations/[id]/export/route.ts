import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generatePptx } from "@/lib/pptx";

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

    const pptxBuffer = await generatePptx(
      presentation as Parameters<typeof generatePptx>[0],
      presentation.colorScheme
    );

    const safeTitle = presentation.title.replace(/[^a-z0-9]/gi, "_").toLowerCase();

    return new NextResponse(pptxBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Disposition": `attachment; filename="${safeTitle}.pptx"`,
        "Content-Length": pptxBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Failed to generate PPTX" }, { status: 500 });
  }
}
