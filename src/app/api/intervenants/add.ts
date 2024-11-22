import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { name, email, availabilities } = req.body;

    try {
      const newIntervenant = await prisma.intervenant.create({
        data: {
          name,
          email,
          availabilities: availabilities || "{}",
        },
      });
      res.status(201).json(newIntervenant);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Erreur lors de la création de l’intervenant" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Méthode ${req.method} non autorisée`);
  }
}
