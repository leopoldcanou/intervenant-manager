import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const workloads = await request.json();

    const results = await Promise.allSettled(
      workloads.map(async (workload: any) => {
        const intervenant = await prisma.intervenant.findFirst({
          where: { email: workload.intervenant },
        });

        if (!intervenant) {
          throw new Error(`Intervenant non trouvé: ${workload.intervenant}`);
        }

        return prisma.intervenant.update({
          where: { id: intervenant.id },
          data: {
            workweek: workload.workweek,
          },
        });
      })
    );

    const errors = results
      .filter((result): result is PromiseRejectedResult => result.status === "rejected")
      .map(result => result.reason.message);

    if (errors.length > 0) {
      return NextResponse.json(
        { message: "Erreurs lors de l'import", errors },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: "Import réussi" });
  } catch (error) {
    console.error("Erreur lors de l'import:", error);
    return NextResponse.json(
      { message: "Erreur lors de l'import des données" },
      { status: 500 }
    );
  }
} 