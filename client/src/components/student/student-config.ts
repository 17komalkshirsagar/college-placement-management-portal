import type { ComponentType } from 'react';
import { Briefcase, FileText, LayoutDashboard, LogOut, User } from 'lucide-react';

export interface StudentNavItem {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
}

export const STUDENT_NAV_ITEMS: StudentNavItem[] = [
  { href: '/student', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/student/profile', label: 'My Profile', icon: User },
  { href: '/student/jobs', label: 'Available Jobs', icon: Briefcase },
  { href: '/student/applications', label: 'Applications', icon: FileText },
];

export const STUDENT_PORTAL_NAME = 'Student Portal';
export const STUDENT_COLLEGE_NAME = 'Vasantrao Naik Mahavidyalaya';
