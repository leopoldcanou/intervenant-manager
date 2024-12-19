import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params;
    const { weekNumber, timeSlot } = await request.json();
    const weekKey = `S${weekNumber}`;

    const intervenant = await prisma.intervenant.findFirst({
      where: { key },
    });

    if (!intervenant) {
      return new NextResponse("Intervenant non trouvé", { status: 404 });
    }

    const currentAvailabilities = intervenant.availabilities as any;
    const existingSlots = currentAvailabilities[weekKey] || [];

    // Filtrer pour retirer le créneau spécifique
    const updatedSlots = existingSlots.filter(
      (slot: any) =>
        !(
          slot.days === timeSlot.days &&
          slot.from === timeSlot.from &&
          slot.to === timeSlot.to
        )
    );

    const updatedAvailabilities = {
      ...currentAvailabilities,
    };

    // Si la liste des créneaux est vide après suppression, supprimer la clé de la semaine
    if (updatedSlots.length === 0) {
      delete updatedAvailabilities[weekKey];
    } else {
      updatedAvailabilities[weekKey] = updatedSlots;
    }

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
