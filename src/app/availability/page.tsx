import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

async function getIntervenantByKey(key: string) {
  const intervenant = await prisma.intervenant.findFirst({
    where: {
      key: key,
    },
  });

  if (!intervenant) {
    notFound();
  }

  const now = new Date();
  if (new Date(intervenant.endDate) < now) {
    throw new Error("Clé expirée");
  }

  return intervenant;
}

export default async function AvailabilityPage({
  searchParams,
}: {
  searchParams: { key?: string };
}) {
  if (!searchParams.key) {
    notFound();
  }

  try {
    const intervenant = await getIntervenantByKey(searchParams.key);
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold">
          Bonjour {intervenant.firstName} {intervenant.lastName}
        </h1>
      </div>
    );
  } catch (error) {
    if (error instanceof Error) {
      return (
        <div className="container mx-auto py-8">
          <div className="bg-destructive/15 text-destructive px-4 py-2 rounded-md">
            {error.message}
          </div>
        </div>
      );
    }
    notFound();
  }
} 