'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, GraduationCap, Home, Info, Menu, PhoneCall } from 'lucide-react';
import { useEffect, useState } from 'react';

import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/jobs', label: 'Jobs', icon: Building2 },
  { href: '/companies', label: 'Companies', icon: Building2 },
  { href: '/students', label: 'Students', icon: GraduationCap },
  { href: '/about', label: 'About', icon: Info },
  { href: '/contact', label: 'Contact', icon: PhoneCall },
];

export function SiteHeader(): React.ReactElement {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = (): void => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={cn('sticky top-0 z-50 border-b bg-background/95 backdrop-blur transition-shadow duration-300', isScrolled && 'shadow-sm')}>
      <div className='container pl-4 md:pl-6 lg:pl-8 pr-4 md:pr-6 lg:pr-8 flex h-16 items-center justify-between gap-4'>
        <Link href='/' className='flex items-center gap-3'>
          <div className='hidden sm:block'>
            <p className='text-sm font-semibold leading-tight'>Vasantrao Naik Mahavidyalaya</p>

          </div>
          <div className='sm:hidden'>
            <p className='text-sm font-semibold leading-tight'>Vasantrao Naik Mahavidyalaya</p>
          </div>
        </Link>

        <div className='hidden lg:block'>
          <NavigationMenu>
            <NavigationMenuList>
              {NAV_ITEMS.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink
                    asChild
                    className={cn(
                      navigationMenuTriggerStyle(),
                      'transition-colors',
                      pathname === item.href && 'bg-accent text-accent-foreground'
                    )}
                  >
                    <Link href={item.href}>{item.label}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className='flex items-center gap-2'>
          <ThemeToggle />
          <Button asChild className='hidden sm:inline-flex'>
            <Link href='/login'>Login</Link>
          </Button>

          <div className='lg:hidden'>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant='outline' size='sm' className='h-9 w-9 p-0'>
                  <Menu className='h-4 w-4' />
                  <span className='sr-only'>Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side='top' className='border-b'>
                <SheetHeader>
                  <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>
                <nav className='mt-6 grid gap-2'>
                  {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent',
                          pathname === item.href && 'bg-accent'
                        )}
                      >
                        <Icon className='h-4 w-4' />
                        {item.label}
                      </Link>
                    );
                  })}
                  <Button asChild className='mt-2'>
                    <Link href='/login'>Login</Link>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
