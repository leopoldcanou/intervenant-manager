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