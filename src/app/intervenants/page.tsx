import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import NavBar from "@/components/nav-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function IntervenantPage() {
  const intervenants = await prisma.intervenant.findMany();

  return (
    <>
      <NavBar />
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Liste des intervenants</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>
    </>
  );
}
