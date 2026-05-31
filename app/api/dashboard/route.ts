import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [totalPresentations, totalSlides, recentPresentations] = await Promise.all([
      prisma.presentation.count({ where: { userId: session.user.id } }),
      prisma.slide.count({
        where: { presentation: { userId: session.user.id } },
      }),
      prisma.presentation.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { slides: { orderBy: { slideNumber: "asc" } } },
      }),
    ]);

    return NextResponse.json({ totalPresentations, totalSlides, recentPresentations });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
