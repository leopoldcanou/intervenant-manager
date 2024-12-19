import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { id } = await request.json();

    const updatedIntervenant = await prisma.intervenant.update({
      where: { id },
      data: {
        key: Math.random().toString(36).substring(7),
      },
    });

    return NextResponse.json(updatedIntervenant);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la régénération de la clé" },
      { status: 500 }
    );
  }
}

export async function PUT() {
  try {
    await prisma.intervenant.updateMany({
      data: {
        key: Math.random().toString(36).substring(7),
      },
    });

    return NextResponse.json({ message: "Clés régénérées avec succès" });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la régénération des clés" },
      { status: 500 }
    );
  }
} 