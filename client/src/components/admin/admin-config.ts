import type { ComponentType } from 'react';
import { BarChart3, BriefcaseBusiness, Building2, FileCheck2, GraduationCap, LayoutDashboard, MessageSquare, Settings, UserCheck2 } from 'lucide-react';

export interface AdminNavItem {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/students', label: 'Students', icon: GraduationCap },
  { href: '/admin/companies', label: 'Companies', icon: Building2 },
  { href: '/admin/jobs', label: 'Jobs', icon: BriefcaseBusiness },
  { href: '/admin/applications', label: 'Applications', icon: FileCheck2 },
  { href: '/admin/selections', label: 'Selections', icon: UserCheck2 },
  { href: '/admin/support-messages', label: 'Support Messages', icon: MessageSquare },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export const ADMIN_PORTAL_NAME = 'Placement Admin';
export const ADMIN_ORG_NAME = 'Vasantrao Naik Mahavidyalaya';
