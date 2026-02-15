'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Briefcase, Calendar, CheckCircle, ChevronLeft, ChevronRight, Clock, FileText, Search, TrendingUp, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { applicationService, type ApplicationListResponse } from '@/services/job-service';

const formatDate = (value?: string): string =>
  value ? new Date(value).toLocaleDateString('en-IN', { dateStyle: 'medium' }) : '-';

const statusColors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  applied: 'secondary',
  shortlisted: 'default',
  rejected: 'destructive',
  selected: 'outline',
};

const statusOptions = ['All', 'applied', 'shortlisted', 'rejected', 'selected'];

type SortField = 'company' | 'jobTitle' | 'appliedDate' | 'status';
type SortOrder = 'asc' | 'desc';

export default function ApplicationsPage(): React.ReactElement {
  const [applications, setApplications] = useState<ApplicationListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('appliedDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const limit = 10;

  const loadApplications = useCallback(async (pageNum: number) => {
    setLoading(true);
    try {
      const filters: { status?: string } = {};
      if (statusFilter !== 'All') {
        filters.status = statusFilter;
      }
      const data = await applicationService.listMyApplications(pageNum, limit);
      setApplications(data);
      setPage(pageNum);
    } catch (error) {
      console.error('Unable to load applications:', error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadApplications(1);
  }, [loadApplications, statusFilter]);

  const handlePageChange = (newPage: number): void => {
    if (applications && newPage >= 1 && newPage <= applications.pagination.totalPages) {
      loadApplications(newPage);
    }
  };

  const handleSort = (field: SortField): void => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedAndFilteredApplications = useMemo(() => {
    if (!applications) return [];
    
    let result = [...applications.items];
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (app) =>
          app.job.company.companyName.toLowerCase().includes(query) ||
          app.job.title.toLowerCase().includes(query) ||
          app.job.location.toLowerCase().includes(query)
      );
    }
    
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'company':
          comparison = a.job.company.companyName.localeCompare(b.job.company.companyName);
          break;
        case 'jobTitle':
          comparison = a.job.title.localeCompare(b.job.title);
          break;
        case 'appliedDate':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return result;
  }, [applications, searchQuery, sortField, sortOrder]);

  const getStatusCount = (status: string): number => {
    if (!applications) return 0;
    if (status === 'All') return applications.pagination.total;
    return applications.items.filter((app) => app.status === status).length;
  };

  if (loading && !applications) {
    return (
      <section className='flex min-h-[60vh] items-center justify-center'>
        <div className='flex flex-col items-center gap-2'>
          <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent'></div>
          <p className='text-sm text-muted-foreground'>Loading applications...</p>
        </div>
      </section>
    );
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold'>My Applications</h1>
        <p className='text-muted-foreground'>Track the status of your job applications</p>
      </div>

      {/* Stats Cards */}
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-5'>
        {statusOptions.map((status) => (
          <Card 
            key={status} 
            className={`cursor-pointer shadow-md transition-all hover:shadow-lg ${statusFilter === status ? 'border-primary ring-1 ring-primary' : ''}`}
            onClick={() => setStatusFilter(status)}
          >
            <CardContent className='flex items-center justify-between p-4'>
              <div>
                <p className='text-sm text-muted-foreground capitalize'>{status === 'All' ? 'Total' : status}</p>
                <p className='text-2xl font-bold'>{getStatusCount(status)}</p>
              </div>
              {status === 'All' && <FileText className='h-8 w-8 text-muted-foreground' />}
              {status === 'applied' && <Clock className='h-8 w-8 text-yellow-500' />}
              {status === 'shortlisted' && <TrendingUp className='h-8 w-8 text-green-500' />}
              {status === 'rejected' && <X className='h-8 w-8 text-red-500' />}
              {status === 'selected' && <CheckCircle className='h-8 w-8 text-blue-500' />}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filter */}
      <Card className='shadow-md'>
        <CardContent className='pt-6'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                className='pl-9'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search by company or job title...'
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Filter by status' />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status} className='capitalize'>
                    {status === 'All' ? 'All Status' : status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card className='shadow-md'>
        <CardHeader>
          <CardTitle>Application History</CardTitle>
          <CardDescription>
            {applications ? `Showing ${sortedAndFilteredApplications.length} of ${applications.pagination.total} applications` : 'Loading...'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!applications || applications.items.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-16 text-center'>
              <Briefcase className='mb-4 h-16 w-16 text-muted-foreground' />
              <p className='text-xl font-medium'>No applications yet</p>
              <p className='text-muted-foreground'>Apply to jobs to see your applications here.</p>
            </div>
          ) : (
            <>
              <div className='rounded-md border'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead 
                        className='cursor-pointer'
                        onClick={() => handleSort('company')}
                      >
                        Company {sortField === 'company' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </TableHead>
                      <TableHead 
                        className='cursor-pointer'
                        onClick={() => handleSort('jobTitle')}
                      >
                        Job Role {sortField === 'jobTitle' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Package</TableHead>
                      <TableHead 
                        className='cursor-pointer'
                        onClick={() => handleSort('appliedDate')}
                      >
                        Applied Date {sortField === 'appliedDate' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </TableHead>
                      <TableHead 
                        className='cursor-pointer'
                        onClick={() => handleSort('status')}
                      >
                        Status {sortField === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedAndFilteredApplications.map((app) => (
                      <TableRow key={app._id}>
                        <TableCell className='font-medium'>{app.job.company.companyName}</TableCell>
                        <TableCell>{app.job.title}</TableCell>
                        <TableCell className='text-muted-foreground'>{app.job.location}</TableCell>
                        <TableCell>{app.job.packageLpa} LPA</TableCell>
                        <TableCell className='text-muted-foreground'>{formatDate(app.createdAt)}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={statusColors[app.status]} 
                            className='capitalize'
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

              {/* Pagination */}
              {applications && applications.pagination.totalPages > 1 && (
                <div className='mt-4 flex items-center justify-between'>
                  <div className='text-sm text-muted-foreground'>
                    Page {applications.pagination.page} of {applications.pagination.totalPages}
                  </div>
                  <div className='flex items-center gap-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handlePageChange(applications.pagination.page - 1)}
                      disabled={applications.pagination.page === 1}
                    >
                      <ChevronLeft className='h-4 w-4' />
                      Previous
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handlePageChange(applications.pagination.page + 1)}
                      disabled={applications.pagination.page === applications.pagination.totalPages}
                    >
                      Next
                      <ChevronRight className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
