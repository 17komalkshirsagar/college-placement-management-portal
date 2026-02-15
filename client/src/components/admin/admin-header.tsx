'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { Bell, ChevronRight, Menu, Search } from 'lucide-react';

import { ADMIN_PORTAL_NAME } from '@/components/admin/admin-config';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { authService } from '@/services/auth-service';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface AdminHeaderProps {
  onOpenMobileMenu: () => void;
  scrolled: boolean;
}

export function AdminHeader({ onOpenMobileMenu, scrolled }: AdminHeaderProps): React.ReactElement {
  const pathname = usePathname();
  const breadcrumbs = useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);
    return segments.map((segment, index) => {
      const href = `/${segments.slice(0, index + 1).join('/')}`;
      const label = segment.charAt(0).toUpperCase() + segment.slice(1);
      return { href, label };
    });
  }, [pathname]);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70',
        scrolled && 'shadow-sm'
      )}
    >
      <div className='flex h-full items-center gap-3 px-4 md:px-6'>
        <Button variant='outline' size='sm' className='lg:hidden' onClick={onOpenMobileMenu} aria-label='Open menu'>
          <Menu className='h-4 w-4' />
        </Button>

        <div className='hidden min-w-0 lg:block'>
          <p className='truncate text-sm font-semibold'>{ADMIN_PORTAL_NAME}</p>
        </div>

        <nav className='hidden min-w-0 items-center gap-1 text-sm text-muted-foreground md:flex'>
          {breadcrumbs.map((item, index) => (
            <div key={item.href} className='flex items-center gap-1'>
              {index > 0 && <ChevronRight className='h-3 w-3' />}
              <Link href={item.href} className={cn('transition-colors hover:text-foreground', index === breadcrumbs.length - 1 && 'text-foreground')}>
                {item.label}
              </Link>
            </div>
          ))}
        </nav>

        <div className='relative ml-auto hidden w-full max-w-sm lg:block'>
          <Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <Input placeholder='Search students, companies, jobs...' className='pl-9' />
        </div>

        <Button variant='ghost' size='sm' className='h-9 w-9 p-0' aria-label='Notifications'>
          <Bell className='h-4 w-4' />
        </Button>

        <ThemeToggle />

        <Button variant='ghost' size='sm' className='text-red-600 hover:text-red-700' onClick={async () => {
          const refreshToken = localStorage.getItem('refresh_token') ?? '';
          try {
            await authService.logout(refreshToken);
          } catch {
            // ignore errors, still clear tokens
          }
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          document.cookie = 'app_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          window.location.href = '/login';
        }}>
          Logout
        </Button>
      </div>
    </header>
  );
}
