'use client';

import { useEffect, useState } from 'react';

import { AdminHeader } from '@/components/admin/admin-header';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps): React.ReactElement {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = (): void => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className='min-h-screen bg-muted/20'>
      <AdminHeader onOpenMobileMenu={() => setMobileOpen(true)} scrolled={scrolled} />

      <aside className='fixed left-0 top-16 hidden h-[calc(100vh-4rem)] border-r lg:block'>
        <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed((prev) => !prev)} />
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side='left' className='w-72 p-0'>
          <AdminSidebar collapsed={false} onToggle={() => undefined} onNavigate={() => setMobileOpen(false)} className='w-full' />
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
