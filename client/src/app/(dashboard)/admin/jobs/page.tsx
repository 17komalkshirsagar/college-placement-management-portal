'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Eye, Filter, Power, Search, Briefcase } from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { jobService, type Job, type JobListResponse } from '@/services/job-service';

const formatDate = (value?: string): string =>
  value ? new Date(value).toLocaleDateString('en-IN', { dateStyle: 'medium' }) : '-';

export default function AdminJobsPage(): React.ReactElement {
  const [jobs, setJobs] = useState<JobListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'closed'>('all');

  const loadJobs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await jobService.listAllJobs(1, 100);
      setJobs(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to load jobs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const filteredJobs = useMemo(() => {
    if (!jobs) return [];
    return jobs.items.filter((job) => {
      const searchText = [job.title, job.company.companyName, job.location, job.eligibility]
        .join(' ')
        .toLowerCase();
      const matchesSearch = !search || searchText.includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || (statusFilter === 'open' && job.isActive) || (statusFilter === 'closed' && !job.isActive);
      return matchesSearch && matchesStatus;
    });
  }, [jobs, search, statusFilter]);

  const handleToggleStatus = async (jobId: string, currentStatus: boolean) => {
    try {
      await jobService.closeJob(jobId);
      toast.success(`Job ${currentStatus ? 'closed' : 'opened'} successfully`);
      loadJobs();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update job status');
    }
  };

  const statusCounts = useMemo(() => {
    if (!jobs) return { all: 0, open: 0, closed: 0 };
    return {
      all: jobs.items.length,
      open: jobs.items.filter((j) => j.isActive).length,
      closed: jobs.items.filter((j) => !j.isActive).length,
    };
  }, [jobs]);

  return (
    <section className='space-y-6'>
      <div className='space-y-1'>
        <h1 className='text-2xl font-semibold tracking-tight'>Job Management</h1>
        <p className='text-sm text-muted-foreground'>Review all company jobs, monitor applicant counts, and moderate postings.</p>
      </div>

      <Card>
        <CardHeader className='gap-3'>
          <CardTitle className='text-lg'>Jobs</CardTitle>
          <div className='flex flex-col gap-3 md:flex-row md:items-center'>
            <div className='relative md:max-w-md'>
              <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                className='pl-9'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Filter by role, company, location...'
              />
            </div>
            <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as 'all' | 'open' | 'closed')}>
              <TabsList>
                <TabsTrigger value='all'>
                  All ({statusCounts.all})
                </TabsTrigger>
                <TabsTrigger value='open'>
                  Open ({statusCounts.open})
                </TabsTrigger>
                <TabsTrigger value='closed'>
                  Closed ({statusCounts.closed})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className='flex items-center justify-center py-12'>
              <p className='text-sm text-muted-foreground'>Loading jobs...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-12 text-center'>
              <Briefcase className='mb-4 h-12 w-12 text-muted-foreground' />
              <p className='text-lg font-medium'>No jobs found</p>
              <p className='text-sm text-muted-foreground'>Try adjusting your filters.</p>
            </div>
          ) : (
            <div className='rounded-md border'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Role</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Package</TableHead>
                    <TableHead>Eligibility</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className='text-right'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJobs.map((job) => (
                    <TableRow key={job._id} className='transition-colors hover:bg-muted/50'>
                      <TableCell className='font-medium'>{job.title}</TableCell>
                      <TableCell>{job.company.companyName}</TableCell>
                      <TableCell>{job.location}</TableCell>
                      <TableCell>{job.packageLpa} LPA</TableCell>
                      <TableCell>{job.eligibility}</TableCell>
                      <TableCell>{formatDate(job.deadline)}</TableCell>
                      <TableCell>
                        <Badge variant={job.isActive ? 'default' : 'secondary'}>{job.isActive ? 'Open' : 'Closed'}</Badge>
                      </TableCell>
                      <TableCell className='text-right'>
                        <div className='inline-flex gap-2'>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => handleToggleStatus(job._id, job.isActive)}
                            title={job.isActive ? 'Close Job' : 'Open Job'}
                          >
                            <Power className='h-4 w-4' />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          {!loading && filteredJobs.length > 0 && (
            <div className='mt-4 flex items-center justify-between text-sm text-muted-foreground'>
              <span>{filteredJobs.length} jobs shown</span>
              <span>
                {statusCounts.open} open • {statusCounts.closed} closed
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
