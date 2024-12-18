import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AvailabilityClient } from "./client";

async function getIntervenantByKey(key: string) {
  const intervenant = await prisma.intervenant.findFirst({
    where: {
      key: key,
    },
  });

  if (!intervenant) {
    return null;
  }

  const now = new Date();
  if (new Date(intervenant.endDate) < now) {
    throw new Error("Clé expirée");
  }

  return intervenant;
}

export default async function AvailabilityPage({
  params,
}: {
  params: { key: string };
}) {
  try {
    const intervenant = await getIntervenantByKey(params.key);

    if (!intervenant) {
      notFound();
    }

    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-8">
          Bonjour {intervenant.firstName} {intervenant.lastName}
        </h1>
        <AvailabilityClient intervenantKey={params.key} />
      </div>
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Clé expirée") {
      return (
        <div className="container mx-auto py-8">
          <div className="bg-destructive/15 text-destructive px-4 py-2 rounded-md">
            {error.message}
          </div>
        </div>
      );
    }
    throw error;
  }
}
