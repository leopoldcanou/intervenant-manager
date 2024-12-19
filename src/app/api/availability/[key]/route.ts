import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { key: string } }
) {
  try {
    const intervenant = await prisma.intervenant.findFirst({
      where: {
        key: params.key,
      },
      select: {
        firstName: true,
        lastName: true,
        availabilities: true,
      },
    });

    if (!intervenant) {
      return new NextResponse("Intervenant non trouvé", { status: 404 });
    }

    return NextResponse.json(intervenant);
  } catch (error) {
    console.error("Erreur:", error);
    return new NextResponse("Erreur serveur", { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { key: string } }
) {
  try {
    const { weekNumber, timeSlot } = await request.json();
    const weekKey = `S${weekNumber}`;

    const intervenant = await prisma.intervenant.findFirst({
      where: { key: params.key },
    });

    if (!intervenant) {
      return new NextResponse("Intervenant non trouvé", { status: 404 });
    }

    const currentAvailabilities = intervenant.availabilities as any;
    
    // Récupérer les créneaux existants pour cette semaine
    const existingSlots = currentAvailabilities[weekKey] || [];
    
    // Ne pas filtrer les créneaux du même jour, simplement ajouter le nouveau
    const updatedAvailabilities = {
      ...currentAvailabilities,
      [weekKey]: [
        ...existingSlots,
        timeSlot,
      ],
    };

    await prisma.intervenant.update({
      where: { key: params.key },
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