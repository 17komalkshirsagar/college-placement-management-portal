'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { StudentHeader } from '@/components/student/student-header';
import { StudentSidebar } from '@/components/student/student-sidebar';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { authService } from '@/services/auth-service';
import { studentService, type StudentProfile } from '@/services/student-service';

interface StudentShellProps {
  children: React.ReactNode;
}

export function StudentShell({ children }: StudentShellProps): React.ReactElement {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [studentName, setStudentName] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const onScroll = (): void => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const loadStudentName = async (): Promise<void> => {
      try {
        const profile = await studentService.getMyProfile();
        setStudentName(profile.user.fullName);
      } catch {
        // ignore
      }
    };
    loadStudentName();
  }, []);

  const handleLogout = useCallback(async (): Promise<void> => {
    const refreshToken = window.localStorage.getItem('refresh_token') ?? '';
    try {
      await authService.logout(refreshToken);
    } catch {
      // ignore errors
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    document.cookie = 'app_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/login');
  }, [router]);

  return (
    <div className='min-h-screen bg-muted/20'>
      <StudentHeader 
        onOpenMobileMenu={() => setMobileOpen(true)} 
        scrolled={scrolled} 
        studentName={studentName}
        onLogout={handleLogout}
      />

      <aside className='fixed left-0 top-16 hidden h-[calc(100vh-4rem)] border-r lg:block'>
        <StudentSidebar 
          collapsed={collapsed} 
          onToggle={() => setCollapsed((prev) => !prev)} 
          onLogout={handleLogout}
        />
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side='left' className='w-72 p-0'>
          <StudentSidebar 
            collapsed={false} 
            onToggle={() => undefined} 
            onNavigate={() => setMobileOpen(false)}
            onLogout={handleLogout}
            className='w-full' 
          />
        </SheetContent>
      </Sheet>

      <main
        className={cn(
          'pt-20 transition-all duration-300',
          'px-4 pb-6 md:px-6',
          'lg:ml-64',
          collapsed && 'lg:ml-20'
        )}
      >
        {children}
      </main>
    </div>
  );
}
