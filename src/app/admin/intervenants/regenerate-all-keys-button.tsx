"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function RegenerateAllKeysButton() {
  const { toast } = useToast();

  const handleRegenerateAll = async () => {
    try {
      const response = await fetch("/api/intervenants/regenerate-key", {
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la régénération des clés");
      }

      toast({
        description: "Toutes les clés ont été régénérées avec succès",
      });
      window.location.reload();
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Erreur lors de la régénération des clés",
      });
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleRegenerateAll}
      className="flex items-center gap-2"
    >
      <RefreshCw className="h-4 w-4" />
      Régénérer toutes les clés
    </Button>
  );
} 