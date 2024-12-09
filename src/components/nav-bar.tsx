import LogoutButton from "./logout-button";
import UserInfo from "./user-info";

export default function NavBar() {
  return (
    <nav className="bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex space-x-4">
            <UserInfo />
          </div>
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
}
