import Link from 'next/link';

import { Card } from '@/components/ui/card';

interface DashboardShellProps {
  title: string;
  children: React.ReactNode;
}

const menuItems = [
  { href: '/admin', label: 'Admin' },
  { href: '/student', label: 'Student' },
  { href: '/company', label: 'Company' },
];

export function DashboardShell({ title, children }: DashboardShellProps): React.ReactElement {
  return (
    <div className='grid min-h-screen grid-cols-1 md:grid-cols-[240px_1fr]'>
      <aside className='border-r bg-white p-4'>
        <h1 className='mb-6 text-lg font-semibold'>Placement Portal</h1>
        <nav className='space-y-2'>
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href} className='block rounded-md px-3 py-2 text-sm hover:bg-slate-100'>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className='bg-slate-50 p-6'>
        <Card className='p-6'>
          <h2 className='mb-4 text-xl font-semibold'>{title}</h2>
          {children}
        </Card>
      </main>
    </div>
  );
}

