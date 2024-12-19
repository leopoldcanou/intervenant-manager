'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium"
    >
      Se déconnecter
    </button>
  );
} 