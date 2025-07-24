'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    setRole(storedRole);
  }, []);

  if (role === null) return null;

  if (role !== 'SELLER') return null;

  return children;
};
