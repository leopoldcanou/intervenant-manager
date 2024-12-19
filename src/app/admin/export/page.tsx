"use client";

import { useState } from "react";
import NavBar from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ExportPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/export");
      if (!response.ok) throw new Error("Erreur lors de l'export");

      const data = await response.json();

      // Créer un blob et le télécharger
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "timeConstraints.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        description: "Export réussi",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Erreur lors de l'export" + error,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className="container mx-auto py-8">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-2xl font-bold">Export des disponibilités</h1>
          <Button
            onClick={handleExport}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {isLoading ? "Export en cours..." : "Exporter les disponibilités"}
          </Button>
        </div>
      </div>
    </>
  );
}
