"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Une erreur est survenue</h2>
      <p className="text-muted-foreground mb-4">{error.message}</p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="text-primary hover:underline"
        >
          Réessayer
        </button>
        <Link
          href="/"
          className="text-primary hover:underline"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
} 