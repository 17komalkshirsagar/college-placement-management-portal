'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Briefcase, LayoutDashboard, LogOut, Menu, Package2, Plus, ScrollText, User, X } from 'lucide-react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { authService } from '@/services/auth-service';
import { companyService, type CompanyProfile } from '@/services/company-service';

const navItems = [
  { href: '/company', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/company/post-job', label: 'Post New Job', icon: Plus },
  { href: '/company/manage-jobs', label: 'Manage Jobs', icon: Briefcase },
  { href: '/company/applications', label: 'Applications', icon: ScrollText },
];

interface CompanyShellProps {
  children: React.ReactNode;
}

export default function CompanyLayout({ children }: CompanyShellProps): React.ReactElement {
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadCompany = async (): Promise<void> => {
      try {
        const data = await companyService.getMyProfile();
        setCompany(data);
      } catch {
        toast.error('Failed to load company profile');
      } finally {
        setLoading(false);
      }
    };
    loadCompany();
  }, []);

  useEffect(() => {
    const onScroll = (): void => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = useCallback(async (): Promise<void> => {
    const refreshToken = window.localStorage.getItem('refresh_token') ?? '';
    try {
      await authService.logout(refreshToken);
    } catch {
      // ignore
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    document.cookie = 'app_role=; max-age=0; path=/';
    router.push('/login');
  }, [router]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className='min-h-screen bg-muted/20'>
      {/* Top Navbar */}
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur transition-all duration-300',
          scrolled && 'shadow-md'
        )}
      >
        <div className='flex h-16 items-center justify-between px-4 md:px-6'>
          <div className='flex items-center gap-4'>
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild className='lg:hidden'>
                <Button variant='ghost' size='icon'>
                  <Menu className='h-5 w-5' />
                </Button>
              </SheetTrigger>
              <SheetContent side='left' className='w-72 p-0'>
                <div className='flex h-16 items-center justify-between border-b px-4'>
                  <span className='text-lg font-bold'>Company Panel</span>
                  <Button variant='ghost' size='icon' onClick={() => setSidebarOpen(false)}>
                    <X className='h-5 w-5' />
                  </Button>
                </div>
                <nav className='space-y-1 p-2'>
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className='flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground'
                    >
                      <item.icon className='h-5 w-5' />
                      {item.label}
                    </Link>
                  ))}
                  <Button
                    variant='ghost'
                    className='w-full justify-start text-red-600 hover:text-red-700'
                    onClick={handleLogout}
                  >
                    <LogOut className='mr-3 h-5 w-5' />
                    Logout
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
            <Link href='/company' className='flex items-center gap-2'>
              <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-primary'>
                <Package2 className='h-5 w-5 text-primary-foreground' />
              </div>
              <span className='text-lg font-bold hidden md:inline'>PlacementHub</span>
            </Link>
          </div>

          <div className='flex items-center gap-2'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='relative h-10 w-10 rounded-full'>
                  <Avatar className='h-10 w-10 border-2 border-primary/20'>
                    <AvatarFallback className='bg-primary/10 text-primary font-semibold'>
                      {loading ? '...' : getInitials(company?.companyName || 'C')}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-56' align='end' forceMount>
                <DropdownMenuLabel className='font-normal'>
                  <div className='flex flex-col space-y-1'>
                    <p className='text-sm font-medium leading-none'>{company?.companyName || 'Company'}</p>
                    <p className='text-xs leading-none text-muted-foreground'>{company?.email || 'company@example.com'}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className='text-red-600 focus:text-red-700 cursor-pointer'>
                  <LogOut className='mr-2 h-4 w-4' />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Sidebar - Desktop */}
      <aside className='fixed left-0 top-16 hidden h-[calc(100vh-4rem)] w-64 border-r bg-background lg:block'>
        <nav className='space-y-1 p-4'>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className='flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-muted hover:text-foreground'
            >
              <item.icon className='h-5 w-5' />
              {item.label}
            </Link>
          ))}
          <div className='my-4 border-t' />
          <Button
            variant='ghost'
            className='w-full justify-start text-red-600 hover:text-red-700'
            onClick={handleLogout}
          >
            <LogOut className='mr-3 h-5 w-5' />
            Logout
          </Button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className='pt-20 pb-6 px-4 md:px-6 lg:pl-72'>
        {children}
      </main>
    </div>
  );
}
