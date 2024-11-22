import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import prisma from "@/lib/prisma";

export default async function IntervenantPage() {
  const intervenants = await prisma.intervenant.findMany();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Liste des intervenants</h1>
      <Table>
        <TableCaption>Liste des intervenants enregistrés</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Disponibilités</TableHead>
            <TableHead>Date de création</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {intervenants.map((intervenant) => (
            <TableRow key={intervenant.id}>
              <TableCell>{intervenant.name}</TableCell>
              <TableCell>{intervenant.email}</TableCell>
              <TableCell>
                {JSON.stringify(intervenant.availabilities)}
              </TableCell>
              <TableCell>
                {new Date(intervenant.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
