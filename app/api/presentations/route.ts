import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  try {
    const [presentations, total] = await Promise.all([
      prisma.presentation.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: { slides: { orderBy: { slideNumber: "asc" } } },
      }),
      prisma.presentation.count({ where: { userId: session.user.id } }),
    ]);

    return NextResponse.json({
      presentations,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Fetch presentations error:", error);
    return NextResponse.json({ error: "Failed to fetch presentations" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Presentation ID required" }, { status: 400 });
  }

  try {
    const presentation = await prisma.presentation.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!presentation) {
      return NextResponse.json({ error: "Presentation not found" }, { status: 404 });
    }

    await prisma.presentation.delete({ where: { id } });
    return NextResponse.json({ message: "Presentation deleted" });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Failed to delete presentation" }, { status: 500 });
  }
}
