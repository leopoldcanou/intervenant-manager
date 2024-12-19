import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container mx-auto py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl mb-4">Page non trouvée</p>
        <p className="text-gray-600">
          La page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>
        <Link
          href="/"
          className="text-primary hover:underline mt-4 inline-block"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
