import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, endDate } = await request.json();

    // Validation des données
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: "Le prénom, le nom et l'email sont requis" },
        { status: 400 }
      );
    }

    const newIntervenant = await prisma.intervenant.create({
      data: {
        firstName,
        lastName,
        email,
        availabilities: "{}",
        endDate: endDate ? new Date(endDate) : new Date(),
        key: Math.random().toString(36).substring(7),
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
