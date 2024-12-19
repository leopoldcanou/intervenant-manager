import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const intervenant = await prisma.intervenant.delete({
      where: { id },
    });

    return NextResponse.json(intervenant);
  } catch (error) {
    return NextResponse.json(
      { error: `Erreur lors de la suppression: ${error}` },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    const intervenant = await prisma.intervenant.update({
      where: { id },
      data,
    });

    return NextResponse.json(intervenant);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'intervenant:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de l'intervenant" },
      { status: 500 }
    );
  }
}
