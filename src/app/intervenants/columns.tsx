"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { X, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EditIntervenantDialog } from "./edit-intervenant-dialog";

export type Intervenant = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  availabilities: string;
  creationDate: Date;
  endDate: Date;
  key: string;
};

async function deleteIntervenant(id: string) {
  const response = await fetch(`/api/intervenants/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la suppression");
  }

  return response.json();
}

async function regenerateKey(id: string) {
  const response = await fetch("/api/intervenants/regenerate-key", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la régénération de la clé");
  }

  return response.json();
}

export const columns: ColumnDef<Intervenant>[] = [
  {
    accessorKey: "firstName",
    header: "Prénom",
  },
  {
    accessorKey: "lastName",
    header: "Nom",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "availabilities",
    header: "Disponibilités",
    cell: ({ row }) => {
      return JSON.stringify(row.original.availabilities);
    },
  },
  {
    accessorKey: "creationDate",
    header: "Date de création",
    cell: ({ row }) => {
      return new Date(row.original.creationDate).toLocaleDateString();
    },
  },
  {
    accessorKey: "endDate",
    header: "Date de fin",
    cell: ({ row }) => {
      return new Date(row.original.endDate).toLocaleDateString();
    },
  },
  {
    accessorKey: "key",
    header: "Clé d'accès",
    cell: ({ row }) => {
      const { toast } = useToast();
      return (
        <div className="flex items-center gap-2">
          <div className="font-mono bg-muted px-2 py-1 rounded inline-block text-sm">
            {row.getValue("key")}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={async () => {
              try {
                await regenerateKey(row.original.id);
                toast({
                  description: "Clé régénérée avec succès",
                });
                window.location.reload();
              } catch (error) {
                toast({
                  variant: "destructive",
                  description: "Erreur lors de la régénération de la clé",
                });
              }
            }}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { toast } = useToast();
      const intervenant = row.original;

      return (
        <div className="flex gap-2">
          <EditIntervenantDialog intervenant={intervenant} />
          <Button
            variant="ghost"
            size="icon"
            onClick={async () => {
              try {
                await deleteIntervenant(intervenant.id);
                toast({
                  description: "Intervenant supprimé avec succès",
                });
                window.location.reload();
              } catch (error) {
                toast({
                  variant: "destructive",
                  description: "Erreur lors de la suppression",
                });
              }
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
