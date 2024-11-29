import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { name, email } = await request.json();

    // Validation des données
    if (!name || !email) {
      return NextResponse.json(
        { error: "Le nom et l'email sont requis" },
        { status: 400 }
      );
    }

    const newIntervenant = await prisma.intervenant.create({
      data: {
        name,
        email,
        availabilities: "{}", // Valeur par défaut
      },
    });

    return NextResponse.json(newIntervenant, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'intervenant" },
      { status: 500 }
    );
  }
} 