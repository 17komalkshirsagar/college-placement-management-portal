'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Search, Users, FileText, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { applicationService, type Application, type ApplicationListResponse } from '@/services/job-service';

const formatDate = (value?: string): string =>
  value ? new Date(value).toLocaleDateString('en-IN', { dateStyle: 'medium' }) : '-';

const statusColors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  applied: 'secondary',
  shortlisted: 'default',
  rejected: 'destructive',
  selected: 'default',
};

export default function AdminApplicationsPage(): React.ReactElement {
  const [applications, setApplications] = useState<ApplicationListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | string>('all');
  const [companyFilter, setCompanyFilter] = useState<string>('all');

  const loadApplications = useCallback(async () => {
    setLoading(true);
    try {
      const data = await applicationService.listAll(1, 100);
      setApplications(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to load applications');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const companies = useMemo(() => {
    if (!applications) return [];
    const companySet = new Set<string>();
    for (const app of applications.items) {
      companySet.add(app.job.company.companyName);
    }
    return Array.from(companySet).sort();
  }, [applications]);

  const filtered = useMemo(() => {
    if (!applications) return [];
    return applications.items.filter((item) => {
      const searchText = [
        item.student.user.fullName,
        item.student.user.email,
        item.job.company.companyName,
        item.job.title,
        item.student.course,
        item.student.branch,
      ]
        .join(' ')
        .toLowerCase();
      const matchesQuery = !query || searchText.includes(query.toLowerCase());
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesCompany = companyFilter === 'all' || item.job.company.companyName === companyFilter;
      return matchesQuery && matchesStatus && matchesCompany;
    });
  }, [applications, query, statusFilter, companyFilter]);

  const statusCounts = useMemo(() => {
    if (!applications) return { all: 0, applied: 0, shortlisted: 0, rejected: 0, selected: 0 };
    return {
      all: applications.items.length,
      applied: applications.items.filter((a) => a.status === 'applied').length,
      shortlisted: applications.items.filter((a) => a.status === 'shortlisted').length,
      rejected: applications.items.filter((a) => a.status === 'rejected').length,
      selected: applications.items.filter((a) => a.status === 'selected').length,
    };
  }, [applications]);

  return (
    <section className='space-y-6'>
      <div className='space-y-1'>
        <h1 className='text-2xl font-semibold tracking-tight'>Applications</h1>
        <p className='text-sm text-muted-foreground'>Track all applications with filters by company, job role, and decision status.</p>
      </div>

      <Card>
        <CardHeader className='gap-3'>
          <CardTitle className='text-lg'>Application Overview</CardTitle>
          <div className='grid gap-3 lg:grid-cols-3'>
            <div className='relative'>
              <Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                className='pl-9'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Search student, company, job, email...'
              />
            </div>
            <Tabs value={statusFilter} onValueChange={setStatusFilter}>
              <TabsList className='grid grid-cols-5'>
                <TabsTrigger value='all'>All ({statusCounts.all})</TabsTrigger>
                <TabsTrigger value='applied'>Applied ({statusCounts.applied})</TabsTrigger>
                <TabsTrigger value='shortlisted'>Shortlisted ({statusCounts.shortlisted})</TabsTrigger>
                <TabsTrigger value='rejected'>Rejected ({statusCounts.rejected})</TabsTrigger>
                <TabsTrigger value='selected'>Selected ({statusCounts.selected})</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className='flex gap-2'>
              <Badge
                variant={companyFilter === 'all' ? 'default' : 'outline'}
                className='cursor-pointer transition-colors'
                onClick={() => setCompanyFilter('all')}
              >
                All Companies
              </Badge>
              {companies.slice(0, 3).map((company) => (
                <Badge
                  key={company}
                  variant={companyFilter === company ? 'default' : 'outline'}
                  className='cursor-pointer transition-colors'
                  onClick={() => setCompanyFilter(company)}
                >
                  {company}
                </Badge>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className='flex items-center justify-center py-12'>
              <p className='text-sm text-muted-foreground'>Loading applications...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-12 text-center'>
              <Users className='mb-4 h-12 w-12 text-muted-foreground' />
              <p className='text-lg font-medium'>No applications found</p>
              <p className='text-sm text-muted-foreground'>Try adjusting your filters.</p>
            </div>
          ) : (
            <div className='rounded-md border'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Skills</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Job</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((item) => (
                    <TableRow key={item._id} className='transition-colors hover:bg-muted/50'>
                      <TableCell className='font-medium'>{item.student.user.fullName}</TableCell>
                      <TableCell className='text-sm text-muted-foreground'>{item.student.user.email}</TableCell>
                      <TableCell>
                        <div className='flex flex-wrap gap-1'>
                          {item.student.skills && item.student.skills.length > 0 ? (
                            item.student.skills.slice(0, 3).map((skill) => (
                              <Badge key={skill} variant='outline' className='text-xs'>
                                {skill}
                              </Badge>
                            ))
                          ) : (
                            <span className='text-xs text-muted-foreground'>-</span>
                          )}
                          {item.student.skills && item.student.skills.length > 3 && (
                            <Badge variant='secondary' className='text-xs'>
                              +{item.student.skills.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{item.job.company.companyName}</TableCell>
                      <TableCell>{item.job.title}</TableCell>
                      <TableCell>{item.student.course}</TableCell>
                      <TableCell>{item.student.branch}</TableCell>
                      <TableCell>{formatDate(item.createdAt)}</TableCell>
                      <TableCell>
                        <Badge variant={statusColors[item.status]}>{item.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          {!loading && filtered.length > 0 && (
            <div className='mt-4 flex items-center justify-between text-sm text-muted-foreground'>
              <span>{filtered.length} applications shown</span>
              <span>
                {statusCounts.selected} selected • {statusCounts.shortlisted} shortlisted • {statusCounts.rejected} rejected
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
