"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import NavBar from "@/components/nav-bar";
import { IntervenantSelector } from "../intervenant-selector";
import { AvailabilityClient } from "@/app/availability/[key]/client";

export default function AdminAvailabilityPage() {
  const params = useParams();
  const [selectedIntervenantKey, setSelectedIntervenantKey] = useState<string | null>(
    params.key as string
  );

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