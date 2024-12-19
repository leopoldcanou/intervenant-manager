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

    let currentAvailabilities = {};
    try {
      currentAvailabilities = JSON.parse(intervenant.availabilities as string || '{}');
    } catch (error) {
      console.error("Erreur parsing availabilities:", error);
      currentAvailabilities = {};
    }
    
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
        availabilities: JSON.stringify(updatedAvailabilities),
      },
    });

    console.log("Disponibilités mises à jour:", updatedIntervenant.availabilities);
    return NextResponse.json({ success: true });
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
    console.log("Sauvegarde des disponibilités:", {
      key: params.key,
      availabilities: JSON.stringify(availabilities, null, 2)
    });

    const updatedIntervenant = await prisma.intervenant.update({
      where: { key: params.key },
      data: {
        availabilities: JSON.stringify(availabilities),
      },
    });

    console.log("Intervenant mis à jour:", updatedIntervenant);

    return NextResponse.json(updatedIntervenant);
  } catch (error) {
    console.error("Erreur lors de la mise à jour:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour des disponibilités" },
      { status: 500 }
    );
  }
}