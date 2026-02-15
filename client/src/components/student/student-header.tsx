'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { Bell, ChevronRight, Menu } from 'lucide-react';

import { STUDENT_PORTAL_NAME } from '@/components/student/student-config';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface StudentHeaderProps {
  onOpenMobileMenu: () => void;
  scrolled: boolean;
  studentName?: string;
  onLogout?: () => void;
}

export function StudentHeader({ onOpenMobileMenu, scrolled, studentName, onLogout }: StudentHeaderProps): React.ReactElement {
  const pathname = usePathname();
  
  const breadcrumbs = useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);
    return segments.map((segment, index) => {
      const href = `/${segments.slice(0, index + 1).join('/')}`;
      const label = segment.charAt(0).toUpperCase() + segment.slice(1);
      return { href, label };
    });
  }, [pathname]);

  const getInitials = (name?: string): string => {
    if (!name) return 'ST';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

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
          <p className='truncate text-sm font-semibold'>{STUDENT_PORTAL_NAME}</p>
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

        <div className='ml-auto flex items-center gap-2'>
          <Button variant='ghost' size='sm' className='h-9 w-9 p-0' aria-label='Notifications'>
            <Bell className='h-4 w-4' />
          </Button>

          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='relative h-9 w-9 rounded-full'>
                <Avatar className='h-9 w-9'>
                  <AvatarFallback className='bg-primary text-primary-foreground text-xs'>
                    {getInitials(studentName)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56' align='end' forceMount>
              <DropdownMenuLabel className='font-normal'>
                <div className='flex flex-col space-y-1'>
                  <p className='text-sm font-medium leading-none'>{studentName || 'Student'}</p>
                  <p className='text-xs leading-none text-muted-foreground'>Student Account</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href='/student/profile'>My Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href='/student/applications'>My Applications</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className='text-red-600 focus:text-red-700 cursor-pointer' onClick={onLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
