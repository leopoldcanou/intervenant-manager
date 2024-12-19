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

export async function GET() {
  try {
    const intervenants = await prisma.intervenant.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        key: true,
      },
      orderBy: {
        lastName: 'asc',
      },
    });

    return NextResponse.json(intervenants);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des intervenants" },
      { status: 500 }
    );
  }
} 