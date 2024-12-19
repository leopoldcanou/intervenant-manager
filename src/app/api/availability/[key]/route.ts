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
        lastModifiedDate: true,
        workweek: true,
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

    // Convertir les disponibilités existantes en objet
    const currentAvailabilities = (intervenant.availabilities as any) || {};

    // Récupérer les créneaux existants pour cette semaine
    const existingSlots = currentAvailabilities[weekKey] || [];

    // Mettre à jour les disponibilités
    const updatedAvailabilities = {
      ...currentAvailabilities,
      [weekKey]: [...existingSlots, timeSlot],
    };

    const updatedIntervenant = await prisma.intervenant.update({
      where: { key: params.key },
      data: {
        availabilities: updatedAvailabilities, // Prisma gérera la conversion en JSON
        lastModifiedDate: new Date(),
      },
      select: {
        firstName: true,
        lastName: true,
        availabilities: true,
        lastModifiedDate: true,
      },
    });

    return NextResponse.json(updatedIntervenant);
  } catch (error) {
    console.error("Erreur:", error);
    return new NextResponse("Erreur serveur", { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { key: string } }
) {
  try {
    const { availabilities } = await request.json();

    const updatedIntervenant = await prisma.intervenant.update({
      where: { key: params.key },
      data: {
        availabilities, // Prisma gérera la conversion en JSON
        lastModifiedDate: new Date(),
      },
    });

    return NextResponse.json(updatedIntervenant);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour des disponibilités" },
      { status: 500 }
    );
  }
}
