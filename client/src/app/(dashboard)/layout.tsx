'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }): React.ReactElement {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = (): void => {
      const token = localStorage.getItem('access_token');
      const userStr = localStorage.getItem('user');
      
      if (!token || !userStr) {
        router.push('/login');
        return;
      }

      try {
        const user = JSON.parse(userStr);
        const currentPath = window.location.pathname;
        
        if (user.role === 'admin' && !currentPath.startsWith('/admin')) {
          router.push('/admin');
        } else if (user.role === 'company' && !currentPath.startsWith('/company')) {
          router.push('/company');
        } else if (user.role === 'student' && !currentPath.startsWith('/student')) {
          router.push('/student');
        }
      } catch {
        router.push('/login');
        return;
      }

      setIsChecking(false);
    };

    checkAuth();
  }, [router]);

  if (isChecking) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent'></div>
      </div>
    );
  }

  return <>{children}</>;
}
