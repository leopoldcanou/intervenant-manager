import Link from "next/link";
import LogoutButton from "./logout-button";
import UserInfo from "./user-info";

export default function NavBar() {
  return (
    <nav className="bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex space-x-4">
            <UserInfo />
            <Link
              href="/admin/intervenants"
              className="text-foreground hover:text-foreground/80"
            >
              Intervenants
            </Link>
            <Link
              href="/admin/availability"
              className="text-foreground hover:text-foreground/80"
            >
              Disponibilités
            </Link>
            <Link
              href="/admin/import"
              className="text-foreground hover:text-foreground/80"
            >
              Import
            </Link>
          </div>
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
}
