import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { name, email, availabilities } = await request.json();

    const newIntervenant = await prisma.intervenant.create({
      data: {
        name,
        email,
        availabilities: availabilities || "{}",
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