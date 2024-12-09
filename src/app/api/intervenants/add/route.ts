import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function generateUniqueKey(): Promise<string> {
  while (true) {
    const key = Math.random().toString(36).substring(7);
    const existingIntervenant = await prisma.intervenant.findUnique({
      where: { key },
    });
    if (!existingIntervenant) {
      return key;
    }
  }
}

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

    const uniqueKey = await generateUniqueKey();

    const newIntervenant = await prisma.intervenant.create({
      data: {
        firstName,
        lastName,
        email,
        availabilities: "{}",
        creationDate: new Date(),
        endDate: endDate ? new Date(endDate) : new Date(),
        key: uniqueKey,
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
