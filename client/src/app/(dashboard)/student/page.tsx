'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Briefcase, Calendar, CheckCircle, Clock, FileText, MapPin, TrendingUp, User, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { studentService, type StudentProfile } from '@/services/student-service';
import { applicationService, type ApplicationListResponse } from '@/services/job-service';

const formatDate = (value?: string): string =>
  value ? new Date(value).toLocaleDateString('en-IN', { dateStyle: 'medium' }) : '-';

const statusColors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  applied: 'secondary',
  shortlisted: 'default',
  rejected: 'destructive',
  selected: 'outline',
};

export default function StudentDashboardPage(): React.ReactElement {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [myApplications, setMyApplications] = useState<ApplicationListResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    try {
      const data = await studentService.getMyProfile();
      setProfile(data);
    } catch (error) {
      console.error('Unable to load profile data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMyApplications = useCallback(async () => {
    try {
      const data = await applicationService.listMyApplications(1, 5);
      setMyApplications(data);
    } catch (error) {
      console.error('Unable to load applications:', error);
    }
  }, []);

  useEffect(() => {
    loadProfile();
    loadMyApplications();
  }, [loadProfile, loadMyApplications]);

  const stats = useMemo(() => {
    if (!myApplications) return { total: 0, applied: 0, shortlisted: 0, rejected: 0 };
    
    const applications = myApplications.items;
    return {
      total: myApplications.pagination.total,
      applied: applications.filter((a) => a.status === 'applied').length,
      shortlisted: applications.filter((a) => a.status === 'shortlisted' || a.status === 'selected').length,
      rejected: applications.filter((a) => a.status === 'rejected').length,
    };
  }, [myApplications]);

  const profileCompletion = useMemo(() => {
    if (!profile) return 0;
    let completed = 0;
    const total = 6;
    
    if (profile.user.fullName) completed++;
    if (profile.mobileNumber) completed++;
    if (profile.course) completed++;
    if (profile.branch) completed++;
    if (profile.year) completed++;
    if (profile.skills && profile.skills.length > 0) completed++;
    
    return Math.round((completed / total) * 100);
  }, [profile]);

  if (loading && !profile) {
    return (
      <section className='flex min-h-[60vh] items-center justify-center'>
        <div className='flex flex-col items-center gap-2'>
          <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent'></div>
          <p className='text-sm text-muted-foreground'>Loading your dashboard...</p>
        </div>
      </section>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Welcome Card */}
      <Card className='border-l-4 border-l-primary shadow-md overflow-hidden relative'>
        <div className='absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none' />
        <CardContent className='flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between relative'>
          <div className='flex items-center gap-4'>
            <div className='flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 animate-pulse'>
              <User className='h-7 w-7 text-primary' />
            </div>
            <div>
              <h1 className='text-2xl font-bold'>Welcome back, {profile?.user.fullName?.split(' ')[0] || 'Student'}!</h1>
              <p className='text-muted-foreground'>Track your placements and apply to new opportunities</p>
            </div>
          </div>
          <div className='flex gap-2'>
            <Button asChild className='transition-transform hover:scale-105 active:scale-95'>
              <Link href='/student/jobs'>Browse Jobs</Link>
            </Button>
            <Button variant='outline' asChild className='transition-transform hover:scale-105 active:scale-95'>
              <Link href='/student/profile'>Edit Profile</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {[
          { title: 'Total Jobs Available', value: stats.total, icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { title: 'Applied Jobs', value: stats.applied, icon: FileText, color: 'text-purple-500', bg: 'bg-purple-500/10' },
          { title: 'Shortlisted', value: stats.shortlisted, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
          { title: 'Rejected', value: stats.rejected, icon: X, color: 'text-red-500', bg: 'bg-red-500/10' },
        ].map((stat, index) => (
          <Card 
            key={stat.title} 
            className='shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-default'
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bg} transition-transform hover:scale-110`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-3xl font-bold transition-all duration-500 hover:scale-110 inline-block'>{stat.value}</div>
              <p className='text-xs text-muted-foreground mt-1'>Open positions</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Profile Completion Progress */}
      <Card className='shadow-md transition-all duration-300 hover:shadow-lg'>
        <CardHeader className='pb-3'>
          <CardTitle className='text-lg flex items-center gap-2'>
            <User className='h-5 w-5 text-primary' />
            Profile Completion
          </CardTitle>
          <CardDescription>Complete your profile to increase your chances of getting hired</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <div className='flex items-center justify-between text-sm'>
              <span className='text-muted-foreground'>Your profile is</span>
              <span className='font-medium transition-all duration-300'>{profileCompletion}% complete</span>
            </div>
            <Progress value={profileCompletion} className='h-3 transition-all duration-1000' />
          </div>
          {profileCompletion < 100 && (
            <Button variant='outline' size='sm' asChild className='transition-all hover:bg-primary hover:text-primary-foreground'>
              <Link href='/student/profile'>Complete Your Profile</Link>
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Recent Applications Table */}
      <Card className='shadow-md transition-all duration-300 hover:shadow-lg'>
        <CardHeader className='flex flex-row items-center justify-between'>
          <div>
            <CardTitle className='text-lg flex items-center gap-2'>
              <Briefcase className='h-5 w-5 text-primary' />
              Recent Applications
            </CardTitle>
            <CardDescription>Your latest job applications status</CardDescription>
          </div>
          <Button variant='ghost' size='sm' asChild className='transition-all hover:bg-primary/10'>
            <Link href='/student/applications'>View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {!myApplications || myApplications.items.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-12 text-center'>
              <div className='mb-4 rounded-full bg-muted p-4 transition-transform hover:scale-110'>
                <FileText className='h-12 w-12 text-muted-foreground' />
              </div>
              <p className='text-lg font-medium'>No applications yet</p>
              <p className='text-sm text-muted-foreground'>Apply to jobs to see your applications here.</p>
              <Button className='mt-4 transition-transform hover:scale-105 active:scale-95' asChild>
                <Link href='/student/jobs'>Browse Jobs</Link>
              </Button>
            </div>
          ) : (
            <div className='rounded-md border overflow-hidden'>
              <Table>
                <TableHeader>
                  <TableRow className='bg-muted/50'>
                    <TableHead>Company</TableHead>
                    <TableHead>Job Role</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myApplications.items.slice(0, 5).map((app, index) => (
                    <TableRow 
                      key={app._id} 
                      className='transition-colors hover:bg-muted/50 cursor-default'
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <TableCell className='font-medium'>{app.job.company.companyName}</TableCell>
                      <TableCell>{app.job.title}</TableCell>
                      <TableCell className='text-muted-foreground'>{formatDate(app.createdAt)}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={statusColors[app.status]} 
                          className='capitalize transition-transform hover:scale-105'
                        >
                          {app.status === 'applied' && <Clock className='mr-1 h-3 w-3' />}
                          {app.status === 'shortlisted' && <TrendingUp className='mr-1 h-3 w-3' />}
                          {app.status === 'rejected' && <X className='mr-1 h-3 w-3' />}
                          {app.status === 'selected' && <CheckCircle className='mr-1 h-3 w-3' />}
                          {app.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
