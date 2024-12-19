"use client";

import { useState } from "react";
import NavBar from "@/components/nav-bar";
import { IntervenantSelector } from "@/app/admin/availability/intervenant-selector";
import { AvailabilityClient } from "@/app/availability/[key]/client";

export default function AdminAvailabilityPage() {
  const [selectedIntervenantKey, setSelectedIntervenantKey] = useState<
    string | null
  >(null);

  return (
    <>
      <NavBar />
      <div className="container mx-auto py-8 space-y-8">
        <IntervenantSelector
          onSelect={setSelectedIntervenantKey}
          defaultValue={selectedIntervenantKey}
        />

        {selectedIntervenantKey && (
          <AvailabilityClient intervenantKey={selectedIntervenantKey} />
        )}
      </div>
    </>
  );
}
