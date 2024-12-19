"use client";

import { useState } from "react";
import NavBar from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Workload {
  intervenant: string;
  workweek: Array<{
    week: number;
    hours: number;
  }>;
}

export default function ImportPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const text = await file.text();
      const workloads: Workload[] = JSON.parse(text);

      // Validation basique
      if (!Array.isArray(workloads)) {
        throw new Error("Le fichier doit contenir un tableau de workloads");
      }

      for (const workload of workloads) {
        if (!workload.intervenant || !Array.isArray(workload.workweek)) {
          throw new Error("Format de données invalide");
        }
      }

      const response = await fetch("/api/admin/import-workloads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(workloads),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erreur lors de l'import");
      }

      toast({
        description: "Import réussi",
      });
    } catch (error) {
      console.error("Erreur:", error);
      setError(error instanceof Error ? error.message : "Erreur lors de l'import");
      toast({
        variant: "destructive",
        description: "Erreur lors de l'import",
      });
    } finally {
      setIsLoading(false);
      event.target.value = ""; // Reset input
    }
  };

  return (
    <>
      <NavBar />
      <div className="container mx-auto py-8">
        <div className="flex flex-col items-center gap-8">
          <h1 className="text-2xl font-bold">Import des workweeks</h1>
          
          <div className="w-full max-w-md space-y-4">
            <div className="flex justify-center">
              <Button
                variant="outline"
                disabled={isLoading}
                className="relative"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                {isLoading ? "Import en cours..." : "Sélectionner un fichier"}
                <input
                  id="file-upload"
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={isLoading}
                />
              </Button>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>
    </>
  );
} 