import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function generateKey(length: number = 6): string {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export async function POST(request: Request) {
  try {
    const { id } = await request.json();

    const updatedIntervenant = await prisma.intervenant.update({
      where: { id },
      data: {
        key: generateKey(),
      },
    });

    return NextResponse.json(updatedIntervenant);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la régénération de la clé" + error },
      { status: 500 }
    );
  }
}

export async function PUT() {
  try {
    const intervenants = await prisma.intervenant.findMany();

    const updates = await Promise.all(
      intervenants.map((intervenant) =>
        prisma.intervenant.update({
          where: { id: intervenant.id },
          data: { key: generateKey() },
        })
      )
    );

    return NextResponse.json({ success: true, count: updates.length });
  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json(
      { error: "Erreur lors de la régénération des clés" },
      { status: 500 }
    );
  }
}
