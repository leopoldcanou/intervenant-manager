import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params;
    const { weekNumber } = await request.json();
    const weekKey = `S${weekNumber}`;

    const intervenant = await prisma.intervenant.findFirst({
      where: { key },
    });

    if (!intervenant) {
      return new NextResponse("Intervenant non trouvé", { status: 404 });
    }

    const currentAvailabilities = intervenant.availabilities as any;
    const weekSlots = currentAvailabilities[weekKey] || [];

    const updatedAvailabilities = {
      ...currentAvailabilities,
      default: weekSlots,
    };

    await prisma.intervenant.update({
      where: { key },
      data: {
        availabilities: updatedAvailabilities,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur:", error);
    return new NextResponse("Erreur serveur", { status: 500 });
  }
}
