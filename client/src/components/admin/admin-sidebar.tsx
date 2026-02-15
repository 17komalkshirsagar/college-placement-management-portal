'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { ADMIN_NAV_ITEMS, ADMIN_ORG_NAME } from '@/components/admin/admin-config';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
  className?: string;
}

export function AdminSidebar({ collapsed, onToggle, onNavigate, className }: AdminSidebarProps): React.ReactElement {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'flex h-full flex-col border-r bg-background/95 px-2 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/70',
        collapsed ? 'w-20' : 'w-64',
        className
      )}
    >
      <div className={cn('mb-4 flex items-center gap-2 px-2', collapsed && 'justify-center')}>
        <div className='flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground'>
          <span className='text-sm font-semibold'>PM</span>
        </div>
        {!collapsed && (
          <div className='min-w-0'>
            <p className='truncate text-sm font-semibold'>Placement Admin</p>
            <p className='truncate text-xs text-muted-foreground'>{ADMIN_ORG_NAME}</p>
          </div>
        )}
      </div>

      <TooltipProvider delayDuration={100}>
        <nav className='space-y-1'>
          {ADMIN_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            const content = (
              <Link
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground',
                  isActive && 'bg-primary/10 text-primary',
                  collapsed && 'justify-center px-0'
                )}
              >
                <Icon className={cn('h-4 w-4 transition-transform duration-200 group-hover:scale-110', isActive && 'text-primary')} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );

            if (!collapsed) {
              return <div key={item.href}>{content}</div>;
            }

            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>{content}</TooltipTrigger>
                <TooltipContent side='right'>{item.label}</TooltipContent>
              </Tooltip>
            );
          })}
        </nav>
      </TooltipProvider>

      <div className='mt-auto px-2'>
        <Button variant='outline' size='sm' className='w-full justify-center gap-2' onClick={onToggle}>
          {collapsed ? <ChevronRight className='h-4 w-4' /> : <ChevronLeft className='h-4 w-4' />}
          {!collapsed && <span>Collapse</span>}
        </Button>
      </div>
    </aside>
  );
}
