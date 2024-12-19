"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Intervenant = {
  id: string;
  firstName: string;
  lastName: string;
  key: string;
};

interface IntervenantSelectorProps {
  onSelect: (key: string) => void;
  defaultValue?: string | null;
}

export function IntervenantSelector({ onSelect, defaultValue }: IntervenantSelectorProps) {
  const [intervenants, setIntervenants] = useState<Intervenant[]>([]);

  useEffect(() => {
    async function fetchIntervenants() {
      const response = await fetch("/api/admin/intervenants");
      const data = await response.json();
      setIntervenants(data);
    }
    fetchIntervenants();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sélectionner un intervenant</CardTitle>
      </CardHeader>
      <CardContent>
        <Select onValueChange={onSelect} defaultValue={defaultValue || undefined}>
          <SelectTrigger>
            <SelectValue placeholder="Choisir un intervenant" />
          </SelectTrigger>
          <SelectContent>
            {intervenants.map((intervenant) => (
              <SelectItem key={intervenant.id} value={intervenant.key}>
                {intervenant.firstName} {intervenant.lastName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
} 