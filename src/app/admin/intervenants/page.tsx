import { prisma } from "@/lib/prisma";
import NavBar from "@/components/nav-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Toaster } from "@/components/ui/toaster";
import RegenerateAllKeysButton from "./regenerate-all-keys-button";
import { AddIntervenantDialog } from "./add-intervenant-dialog";

export default async function IntervenantPage() {
  const intervenants = await prisma.intervenant.findMany();

  return (
    <>
      <NavBar />
      <Toaster />
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Liste des intervenants</CardTitle>
            <div className="flex items-center gap-4">
              <AddIntervenantDialog />
              <RegenerateAllKeysButton />
            </div>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={intervenants} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
