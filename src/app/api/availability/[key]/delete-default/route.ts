import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { key: string } }
) {
  try {
    const { timeSlot } = await request.json();

    const intervenant = await prisma.intervenant.findFirst({
      where: { key: params.key },
    });

    if (!intervenant) {
      return new NextResponse("Intervenant non trouvé", { status: 404 });
    }

    const currentAvailabilities = intervenant.availabilities as any;
    const defaultSlots = currentAvailabilities.default || [];

    // Filtrer pour retirer le créneau spécifique des disponibilités par défaut
    const updatedDefaultSlots = defaultSlots.filter(
      (slot: any) =>
        !(
          slot.days === timeSlot.days &&
          slot.from === timeSlot.from &&
          slot.to === timeSlot.to
        )
    );

    const updatedAvailabilities = {
      ...currentAvailabilities,
      default: updatedDefaultSlots,
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