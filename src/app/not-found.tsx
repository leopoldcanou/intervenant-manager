import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">404 - Page non trouvée</h2>
      <p className="text-muted-foreground mb-4">
        La page que vous recherchez n&apos;existe pas ou la clé est invalide.
      </p>
      <Link
        href="/"
        className="text-primary hover:underline"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
} 