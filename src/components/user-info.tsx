"use client";

import { useSession } from "next-auth/react";

export default function UserInfo() {
  const { data: session } = useSession();

  if (!session?.user) return null;

  return (
    <>
      <div className="text-md font-semibold text-foreground">
        {session.user.name}
      </div>
      <div className="text-md font-light text-foreground">
        {session.user.email}
      </div>
    </>
  );
}
