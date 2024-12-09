"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { X, RefreshCw, Copy, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EditIntervenantDialog } from "./edit-intervenant-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

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

type CellProps = {
  row: Row<Intervenant>;
};

const KeyCell = ({ row }: CellProps) => {
  const { toast } = useToast();
  const availabilityUrl = `${
    window.location.origin
  }/availability/${row.getValue("key")}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(availabilityUrl);
      toast({
        description: "Lien copié dans le presse-papier",
      });
    } catch {
      toast({
        variant: "destructive",
        description: "Erreur lors de la copie du lien",
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="font-mono bg-muted px-2 py-1 rounded inline-block text-sm">
        {row.getValue("key")}
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={copyToClipboard}>
              <Copy className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Copier le lien</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
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
                    description:
                      "Erreur lors de la régénération de la clé : " + error,
                  });
                }
              }}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Régénérer la clé</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

const ActionsCell = ({ row }: CellProps) => {
  const { toast } = useToast();
  const intervenant = row.original;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteIntervenant(intervenant.id);
      toast({
        description: "Intervenant supprimé avec succès",
      });
      setIsDeleteDialogOpen(false);
      window.location.reload();
    } catch {
      toast({
        variant: "destructive",
        description: "Erreur lors de la suppression",
      });
    }
  };

  return (
    <div className="flex gap-2">
      <TooltipProvider>
        <Tooltip>
          <EditIntervenantDialog intervenant={intervenant}>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Pencil className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
          </EditIntervenantDialog>
          <TooltipContent>
            <p>Modifier l&apos;intervenant</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-4 w-4" />
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>Supprimer l&apos;intervenant</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer l&apos;intervenant{" "}
              {intervenant.firstName} {intervenant.lastName} ? Cette action est
              irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

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
    cell: ({ row }) => <KeyCell row={row} />,
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
