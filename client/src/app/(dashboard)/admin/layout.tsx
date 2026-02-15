import { AdminShell } from '@/components/admin/admin-shell';

export default function AdminLayout({ children }: { children: React.ReactNode }): React.ReactElement {
  return <AdminShell>{children}</AdminShell>;
}
