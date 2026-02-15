'use client';

import { useCallback, useEffect, useState } from 'react';
import { FileText, CheckCircle, XCircle, Clock, TrendingUp, Users, Filter, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { companyService, type Application } from '@/services/company-service';

const formatDate = (value?: string): string =>
  value ? new Date(value).toLocaleDateString('en-IN', { dateStyle: 'medium' }) : '-';

const statusColors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline' | 'success'> = {
  applied: 'secondary',
  shortlisted: 'success',
  rejected: 'destructive',
  selected: 'default',
};

const statusOptions = [
  { value: 'applied', label: 'Applied' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'selected', label: 'Selected' },
];

export default function CompanyApplicationsPage(): React.ReactElement {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [jobFilter, setJobFilter] = useState<string>('all');
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const loadApplications = useCallback(async () => {
    setLoading(true);
    try {
      const filters: { status?: string; jobId?: string } = {};
      if (statusFilter !== 'all') filters.status = statusFilter;
      if (jobFilter !== 'all') filters.jobId = jobFilter;
      
      const data = await companyService.getApplications(1, 100, filters);
      setApplications(data.items);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to load applications');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, jobFilter]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const jobs = applications.reduce((acc, app) => {
    if (!acc.find((j) => j._id === app.job._id)) {
      acc.push({ _id: app.job._id, title: app.job.title });
    }
    return acc;
  }, [] as { _id: string; title: string }[]);

  const handleUpdateStatus = async (applicationId: string, status: 'shortlisted' | 'rejected' | 'selected') => {
    setUpdatingStatus(applicationId);
    try {
      await companyService.updateApplicationStatus(applicationId, status);
      toast.success(`Application ${status}`);
      loadApplications();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getCountByStatus = (status: string) => {
    if (status === 'all') return applications.length;
    return applications.filter((a) => a.status === status).length;
  };

  const statusTabs = [
    { key: 'all', label: 'All', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { key: 'applied', label: 'Applied', icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { key: 'shortlisted', label: 'Shortlisted', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
    { key: 'rejected', label: 'Rejected', icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
    { key: 'selected', label: 'Selected', icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ] as const;

  return (
    <div className='space-y-6'>
      {/* Header */}
      <Card className='border-l-4 border-l-primary shadow-md overflow-hidden relative'>
        <div className='absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none' />
        <CardContent className='pt-6'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <h1 className='text-2xl font-bold'>Applications</h1>
              <p className='text-muted-foreground'>Review and manage candidate applications</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className='shadow-md transition-all duration-300 hover:shadow-lg'>
        <CardContent className='pt-6'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
            <div className='flex items-center gap-2'>
              <Filter className='h-4 w-4 text-muted-foreground' />
              <span className='text-sm font-medium'>Filters:</span>
            </div>
            <div className='flex gap-4 flex-1'>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className='w-[180px] transition-all focus:ring-2 focus:ring-primary'>
                  <SelectValue placeholder='Filter by status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Status</SelectItem>
                  {statusOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={jobFilter} onValueChange={setJobFilter}>
                <SelectTrigger className='w-[250px] transition-all focus:ring-2 focus:ring-primary'>
                  <SelectValue placeholder='Filter by job' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Jobs</SelectItem>
                  {jobs.map((job) => (
                    <SelectItem key={job._id} value={job._id}>
                      {job.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Summary Cards */}
      <div className='grid gap-4 md:grid-cols-5'>
        {statusTabs.map((stat, index) => (
          <Card 
            key={stat.key} 
            className={`shadow-md transition-all duration-300 hover:shadow-lg cursor-pointer ${statusFilter === stat.key ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setStatusFilter(stat.key)}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>{stat.label}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{getCountByStatus(stat.key)}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Applications Table */}
      <Card className='shadow-md transition-all duration-300 hover:shadow-lg'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Users className='h-5 w-5 text-primary' />
            Candidate Applications
          </CardTitle>
          <CardDescription>
            {statusFilter === 'all' ? 'All applications' : `Applications with status: ${statusFilter}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className='flex items-center justify-center py-12'>
              <Loader2 className='h-8 w-8 animate-spin text-primary' />
            </div>
          ) : applications.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-12 text-center'>
              <FileText className='mb-4 h-12 w-12 text-muted-foreground' />
              <p className='text-lg font-medium'>No applications found</p>
              <p className='text-sm text-muted-foreground'>
                {statusFilter !== 'all' 
                  ? `No applications with status "${statusFilter}"`
                  : 'No candidates have applied yet.'}
              </p>
            </div>
          ) : (
            <div className='rounded-md border overflow-hidden'>
              <Table>
                <TableHeader>
                  <TableRow className='bg-muted/50'>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Applied For</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Skills</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className='text-right'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app, index) => (
                    <TableRow 
                      key={app._id} 
                      className='transition-colors hover:bg-muted/50 cursor-default'
                      style={{ animationDelay: `${index * 20}ms` }}
                    >
                      <TableCell className='font-medium'>{app.student.user.fullName}</TableCell>
                      <TableCell>
                        <div className='flex flex-col'>
                          <span className='font-medium'>{app.job.title}</span>
                          <span className='text-xs text-muted-foreground'>{app.job.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='flex flex-col text-sm'>
                          <span>{app.student.user.email}</span>
                          {app.student.mobileNumber && (
                            <span className='text-muted-foreground'>{app.student.mobileNumber}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='flex flex-wrap gap-1'>
                          {app.student.skills && app.student.skills.length > 0 ? (
                            app.student.skills.slice(0, 3).map((skill) => (
                              <Badge key={skill} variant='outline' className='text-xs'>
                                {skill}
                              </Badge>
                            ))
                          ) : (
                            <span className='text-xs text-muted-foreground'>-</span>
                          )}
                          {app.student.skills && app.student.skills.length > 3 && (
                            <Badge variant='secondary' className='text-xs'>
                              +{app.student.skills.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='flex flex-col text-sm'>
                          <span>{app.student.course}</span>
                          <span className='text-xs text-muted-foreground'>{app.student.branch} • Year {app.student.year}</span>
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
                              <Button variant='outline' size='sm' className='h-8 w-8 p-0 transition-all hover:scale-105'>
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
                                className='h-8 w-8 p-0 transition-all hover:scale-105'
                              >
                                <CheckCircle className='h-4 w-4 text-green-600' />
                              </Button>
                              <Button
                                variant='outline'
                                size='sm'
                                onClick={() => handleUpdateStatus(app._id, 'rejected')}
                                disabled={updatingStatus === app._id}
                                title='Reject'
                                className='h-8 w-8 p-0 transition-all hover:scale-105'
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
                              className='h-8 w-8 p-0 transition-all hover:scale-105'
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
    </div>
  );
}
