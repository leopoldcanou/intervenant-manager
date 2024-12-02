import LogoutButton from "./logout-button";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NavBar() {
  return (
    <nav className="bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex space-x-4"></div>
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
}
