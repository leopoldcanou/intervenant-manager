import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const intervenants = await prisma.intervenant.findMany({
      select: {
        firstName: true,
        lastName: true,
        availabilities: true,
        lastModifiedDate: true,
      },
    });

    const formattedData = {
      export_date: new Date().toISOString(),
      intervenants: intervenants
        .map(intervenant => {
          if (!intervenant.availabilities) {
            return null;
          }

          let timeConstraints;
          try {
            if (typeof intervenant.availabilities === 'string') {
              timeConstraints = JSON.parse(intervenant.availabilities);
            } else {
              timeConstraints = intervenant.availabilities;
            }

            if (!timeConstraints || Object.keys(timeConstraints).length === 0) {
              return null;
            }

            return {
              name: `${intervenant.firstName} ${intervenant.lastName}`,
              timeConstraints,
              last_modified: intervenant.lastModifiedDate?.toISOString() || null,
            };
          } catch (error) {
            return null;
          }
        })
        .filter(item => item !== null),
    };

    return NextResponse.json(formattedData);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de l'export des données" },
      { status: 500 }
    );
  }
} 