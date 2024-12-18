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