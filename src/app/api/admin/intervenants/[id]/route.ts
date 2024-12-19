import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const intervenant = await prisma.intervenant.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json(intervenant)
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la suppression" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { firstName, lastName, email, endDate } = await request.json();

    const updatedIntervenant = await prisma.intervenant.update({
      where: {
        id: params.id,
      },
      data: {
        firstName,
        lastName,
        email,
        endDate: new Date(endDate),
      },
    });

    return NextResponse.json(updatedIntervenant);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la modification" },
      { status: 500 }
    );
  }
} 