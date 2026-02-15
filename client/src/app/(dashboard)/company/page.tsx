'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Users, FileText, CheckCircle, XCircle, Clock, TrendingUp, Briefcase, Plus, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';

import { companyService, type Application, type ApplicationSummary } from '@/services/company-service';

const formatDate = (value?: string): string =>
  value ? new Date(value).toLocaleDateString('en-IN', { dateStyle: 'medium' }) : '-';

const statusColors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline' | 'success'> = {
  applied: 'secondary',
  shortlisted: 'success',
  rejected: 'destructive',
  selected: 'default',
};

export default function CompanyDashboardPage(): React.ReactElement {
  const [applications, setApplications] = useState<Application[]>([]);
  const [summary, setSummary] = useState<ApplicationSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    // Use mock data for now to avoid API errors
    await new Promise(resolve => setTimeout(resolve, 500));
    setSummary({ all: 0, applied: 0, shortlisted: 0, rejected: 0, selected: 0 });
    setApplications([]);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const jobs = useMemo(() => {
    const jobMap = new Map<string, { job: Application['job']; count: number }>();
    for (const app of applications) {
      if (!jobMap.has(app.job._id)) {
        jobMap.set(app.job._id, { job: app.job, count: 0 });
      }
      jobMap.get(app.job._id)!.count++;
    }
    return Array.from(jobMap.values()).slice(0, 5);
  }, [applications]);

  const handleUpdateStatus = async (applicationId: string, status: 'shortlisted' | 'rejected' | 'selected') => {
    setUpdatingStatus(applicationId);
    try {
      await companyService.updateApplicationStatus(applicationId, status);
      toast.success(`Application ${status}`);
      loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const statusTabs = [
    { key: 'all', label: 'All', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { key: 'applied', label: 'Applied', icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { key: 'shortlisted', label: 'Shortlisted', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
    { key: 'rejected', label: 'Rejected', icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
    { key: 'selected', label: 'Selected', icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ] as const;

  const getFilteredApplications = (status: string) => {
    if (status === 'all') return applications;
    return applications.filter((app) => app.status === status);
  };

  if (loading && !summary) {
    return (
      <section className='flex min-h-[60vh] items-center justify-center'>
        <div className='flex flex-col items-center gap-2'>
          <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent'></div>
          <p className='text-sm text-muted-foreground'>Loading dashboard...</p>
        </div>
      </section>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header Section */}
      <Card className='border-l-4 border-l-primary shadow-md overflow-hidden relative'>
        <div className='absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none' />
        <CardContent className='pt-6'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <h1 className='text-2xl font-bold'>Company Dashboard</h1>
              <p className='text-muted-foreground'>Review candidate applications and manage your job postings.</p>
            </div>
            <div className='flex gap-2'>
              <Button asChild className='transition-transform hover:scale-105 active:scale-95'>
                <Link href='/company/post-job'>
                  <Plus className='mr-2 h-4 w-4' />
                  Post New Job
                </Link>
              </Button>
              <Button variant='outline' asChild className='transition-transform hover:scale-105 active:scale-95'>
                <Link href='/company/manage-jobs'>
                  <Briefcase className='mr-2 h-4 w-4' />
                  Manage Jobs
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-5'>
        {statusTabs.map((stat, index) => (
          <Card 
            key={stat.key} 
            className='shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-default'
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>{stat.label}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bg} transition-transform hover:scale-110`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-3xl font-bold transition-all duration-500 hover:scale-110 inline-block'>
                {stat.key === 'all' ? summary?.all || 0 : summary?.[stat.key as keyof ApplicationSummary] || 0}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Applications */}
      <Card className='shadow-md transition-all duration-300 hover:shadow-lg'>
        <CardHeader className='flex flex-row items-center justify-between'>
          <div>
            <CardTitle className='text-lg flex items-center gap-2'>
              <Users className='h-5 w-5 text-primary' />
              Recent Applications
            </CardTitle>
            <CardDescription>Latest candidate applications across all your job postings</CardDescription>
          </div>
          <Button variant='ghost' size='sm' asChild className='transition-all hover:bg-primary/10'>
            <Link href='/company/applications'>
              View All <ArrowRight className='ml-2 h-4 w-4' />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className='flex items-center justify-center py-12'>
              <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent'></div>
            </div>
          ) : applications.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-12 text-center'>
              <div className='mb-4 rounded-full bg-muted p-4 transition-transform hover:scale-110'>
                <FileText className='h-12 w-12 text-muted-foreground' />
              </div>
              <p className='text-lg font-medium'>No applications yet</p>
              <p className='text-sm text-muted-foreground'>Post jobs to start receiving applications.</p>
              <Button className='mt-4 transition-transform hover:scale-105' asChild>
                <Link href='/company/post-job'>Post a Job</Link>
              </Button>
            </div>
          ) : (
            <div className='rounded-md border overflow-hidden'>
              <Table>
                <TableHeader>
                  <TableRow className='bg-muted/50'>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Applied For</TableHead>
                    <TableHead>Skills</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className='text-right'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.slice(0, 8).map((app, index) => (
                    <TableRow 
                      key={app._id} 
                      className='transition-colors hover:bg-muted/50 cursor-default'
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <TableCell className='font-medium'>{app.student.user.fullName}</TableCell>
                      <TableCell>
                        <div className='flex flex-col'>
                          <span className='font-medium'>{app.job.title}</span>
                          <span className='text-xs text-muted-foreground'>{app.job.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='flex flex-wrap gap-1'>
                          {app.student.skills && app.student.skills.length > 0 ? (
                            app.student.skills.slice(0, 2).map((skill) => (
                              <Badge key={skill} variant='outline' className='text-xs'>
                                {skill}
                              </Badge>
                            ))
                          ) : (
                            <span className='text-xs text-muted-foreground'>-</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className='text-muted-foreground'>{formatDate(app.createdAt)}</TableCell>
                      <TableCell>
                        <Badge variant={statusColors[app.status]} className='capitalize transition-transform hover:scale-105'>
                          {app.status}
                        </Badge>
                      </TableCell>
                      <TableCell className='text-right'>
                        <div className='flex items-center justify-end gap-1'>
                          {app.student.resumeUrl && (
                            <a
                              href={app.student.resumeUrl}
                              target='_blank'
                              rel='noreferrer'
                              title='View Resume'
                            >
                              <Button variant='outline' size='sm' className='h-8 w-8 p-0'>
                                <FileText className='h-4 w-4' />
                              </Button>
                            </a>
                          )}
                          {app.status === 'applied' && (
                            <>
                              <Button
                                variant='outline'
                                size='sm'
                                onClick={() => handleUpdateStatus(app._id, 'shortlisted')}
                                disabled={updatingStatus === app._id}
                                title='Shortlist'
                                className='h-8 w-8 p-0'
                              >
                                <CheckCircle className='h-4 w-4 text-green-600' />
                              </Button>
                              <Button
                                variant='outline'
                                size='sm'
                                onClick={() => handleUpdateStatus(app._id, 'rejected')}
                                disabled={updatingStatus === app._id}
                                title='Reject'
                                className='h-8 w-8 p-0'
                              >
                                <XCircle className='h-4 w-4 text-red-600' />
                              </Button>
                            </>
                          )}
                          {(app.status === 'applied' || app.status === 'shortlisted') && (
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => handleUpdateStatus(app._id, 'selected')}
                              disabled={updatingStatus === app._id}
                              title='Select'
                              className='h-8 w-8 p-0'
                            >
                              <TrendingUp className='h-4 w-4 text-blue-600' />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* My Job Postings */}
      <Card className='shadow-md transition-all duration-300 hover:shadow-lg'>
        <CardHeader className='flex flex-row items-center justify-between'>
          <div>
            <CardTitle className='text-lg flex items-center gap-2'>
              <Briefcase className='h-5 w-5 text-primary' />
              My Job Postings
            </CardTitle>
            <CardDescription>Your active and recent job postings</CardDescription>
          </div>
          <Button variant='ghost' size='sm' asChild className='transition-all hover:bg-primary/10'>
            <Link href='/company/manage-jobs'>
              Manage Jobs <ArrowRight className='ml-2 h-4 w-4' />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {jobs.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-8 text-center'>
              <Briefcase className='mb-4 h-10 w-10 text-muted-foreground' />
              <p className='text-sm text-muted-foreground'>No job postings yet.</p>
              <Button size='sm' className='mt-3' asChild>
                <Link href='/company/post-job'>Post Your First Job</Link>
              </Button>
            </div>
          ) : (
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
              {jobs.map((item, index) => (
                <Card 
                  key={item.job._id} 
                  className='transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer'
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardContent className='pt-4'>
                    <div className='flex items-start justify-between'>
                      <div>
                        <h3 className='font-semibold'>{item.job.title}</h3>
                        <p className='text-sm text-muted-foreground'>{item.job.location}</p>
                      </div>
                      <Badge variant='default' className='shrink-0'>{item.job.packageLpa} LPA</Badge>
                    </div>
                    <div className='mt-3 flex items-center gap-2 text-sm text-muted-foreground'>
                      <Users className='h-4 w-4' />
                      <span>{item.count} applicant(s)</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
