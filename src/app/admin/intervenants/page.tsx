"use client";

import { DataTable } from "./data-table";
import { columns } from "./columns";
import { AddIntervenantDialog } from "./add-intervenant-dialog";
import RegenerateAllKeysButton from "./regenerate-all-keys-button";
import NavBar from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Intervenant } from "./columns";

export default function IntervenantsPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [intervenants, setIntervenants] = useState<Intervenant[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchIntervenants = async () => {
      try {
        const response = await fetch("/api/admin/intervenants");
        if (!response.ok) throw new Error("Erreur lors du chargement");
        const data = await response.json();
        setIntervenants(data);
      } catch (error) {
        toast({
          variant: "destructive",
          description: "Erreur lors du chargement des intervenants",
        });
      }
    };

    fetchIntervenants();
  }, [toast]);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await fetch("/api/admin/export");
      if (!response.ok) throw new Error("Erreur lors de l'export");
      
      const data = await response.json();
      
      if (data.length === 0) {
        toast({
          variant: "destructive",
          description: "Aucune donnée à exporter",
        });
        return;
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "timeConstraints.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        description: `Export réussi (${data.length} intervenants)`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Erreur lors de l'export",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <RegenerateAllKeysButton />
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {isExporting ? "Export en cours..." : "Exporter"}
            </Button>
          </div>
          <AddIntervenantDialog />
        </div>
        <DataTable columns={columns} data={intervenants} />
      </div>
    </>
  );
}
