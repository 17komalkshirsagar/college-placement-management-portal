'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Briefcase, Calendar, CheckCircle, Clock, Filter, MapPin, Paperclip, Search, TrendingUp, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import { studentService, type StudentProfile } from '@/services/student-service';
import { jobService, applicationService, type Job, type ApplicationListResponse } from '@/services/job-service';

const formatDate = (value?: string): string =>
  value ? new Date(value).toLocaleDateString('en-IN', { dateStyle: 'medium' }) : '-';

const locationOptions = ['All Locations', 'Mumbai', 'Pune', 'Bangalore', 'Hyderabad', 'Remote'];
const jobTypeOptions = ['All Types', 'Full-time', 'Internship', 'Contract'];

export default function AvailableJobsPage(): React.ReactElement {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [myApplications, setMyApplications] = useState<ApplicationListResponse | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [jobsLoading, setJobsLoading] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('All Locations');
  const [typeFilter, setTypeFilter] = useState('All Types');
  
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);
  const [coverLetter, setCoverLetter] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [profileData, jobsData, applicationsData] = await Promise.all([
        studentService.getMyProfile(),
        jobService.listAllJobs(1, 50, { isActive: true }),
        applicationService.listMyApplications(1, 100),
      ]);
      setProfile(profileData);
      setJobs(jobsData.items);
      setMyApplications(applicationsData);
    } catch (error) {
      console.error('Unable to load data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshJobs = useCallback(async () => {
    setJobsLoading(true);
    try {
      const filters: { isActive: boolean; location?: string } = { isActive: true };
      if (locationFilter !== 'All Locations') {
        filters.location = locationFilter;
      }
      const data = await jobService.listAllJobs(1, 50, filters);
      setJobs(data.items);
    } catch (error) {
      console.error('Unable to load jobs:', error);
    } finally {
      setJobsLoading(false);
    }
  }, [locationFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const appliedJobIds = useMemo(() => {
    if (!myApplications) return new Set<string>();
    return new Set(myApplications.items.map((app) => app.job._id));
  }, [myApplications]);

  const filteredJobs = useMemo(() => {
    let result = jobs;
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(query) ||
          job.company.companyName.toLowerCase().includes(query) ||
          job.location.toLowerCase().includes(query) ||
          job.eligibility.toLowerCase().includes(query)
      );
    }
    
    if (locationFilter !== 'All Locations') {
      result = result.filter((job) => job.location.toLowerCase() === locationFilter.toLowerCase());
    }
    
    return result;
  }, [jobs, searchQuery, locationFilter]);

  const handleApplyClick = (job: Job): void => {
    if (!profile?.resumeUrl) {
      toast.error('Please upload your resume first before applying to jobs');
      return;
    }
    setSelectedJob(job);
    setApplyDialogOpen(true);
  };

  const handleSubmitApplication = async (): Promise<void> => {
    if (!selectedJob || !profile?.resumeUrl) return;

    setApplyingJobId(selectedJob._id);
    try {
      await jobService.applyToJob(selectedJob._id, profile.resumeUrl, coverLetter || undefined);
      toast.success(`Successfully applied to ${selectedJob.title}`);
      setApplyDialogOpen(false);
      setCoverLetter('');
      setSelectedJob(null);
      loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to apply');
    } finally {
      setApplyingJobId(null);
    }
  };

  if (loading) {
    return (
      <section className='flex min-h-[60vh] items-center justify-center'>
        <div className='flex flex-col items-center gap-2'>
          <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent'></div>
          <p className='text-sm text-muted-foreground'>Loading jobs...</p>
        </div>
      </section>
    );
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold'>Available Jobs</h1>
        <p className='text-muted-foreground'>Browse and apply to open positions from top companies</p>
      </div>

      {/* Search and Filters */}
      <Card className='shadow-md'>
        <CardContent className='pt-6'>
          <div className='flex flex-col gap-4 lg:flex-row lg:items-center'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                className='pl-9'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search by role, company, location...'
              />
            </div>
            <div className='flex gap-2'>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className='w-[180px]'>
                  <MapPin className='mr-2 h-4 w-4' />
                  <SelectValue placeholder='Location' />
                </SelectTrigger>
                <SelectContent>
                  {locationOptions.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className='w-[180px]'>
                  <Filter className='mr-2 h-4 w-4' />
                  <SelectValue placeholder='Job Type' />
                </SelectTrigger>
                <SelectContent>
                  {jobTypeOptions.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Jobs Grid */}
      {jobsLoading ? (
        <div className='flex justify-center py-12'>
          <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent'></div>
        </div>
      ) : filteredJobs.length === 0 ? (
        <Card className='shadow-md'>
          <CardContent className='flex flex-col items-center justify-center py-16 text-center'>
            <Briefcase className='mb-4 h-16 w-16 text-muted-foreground' />
            <p className='text-xl font-medium'>No jobs found</p>
            <p className='text-muted-foreground'>Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      ) : (
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {filteredJobs.map((job, index) => {
            const hasApplied = appliedJobIds.has(job._id);
            const isDeadlinePassed = new Date(job.deadline) < new Date();
            
            return (
              <Card 
                key={job._id} 
                className='flex flex-col shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-default'
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardHeader className='pb-3 relative overflow-hidden'>
                  <div className='absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none' />
                  <div className='flex items-start justify-between relative'>
                    <div className='flex-1'>
                      <CardTitle className='text-lg leading-tight transition-colors hover:text-primary'>{job.title}</CardTitle>
                      <CardDescription className='mt-1 flex items-center gap-1'>
                        <Briefcase className='h-3 w-3' />
                        {job.company.companyName}
                      </CardDescription>
                    </div>
                    {hasApplied && (
                      <Badge variant='default' className='ml-2 shrink-0 bg-green-600 transition-transform hover:scale-110'>
                        <CheckCircle className='mr-1 h-3 w-3' />
                        Applied
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className='flex-1 space-y-3 pt-0'>
                  <div className='flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground'>
                    <MapPin className='h-4 w-4' />
                    {job.location}
                  </div>
                  <div className='flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground'>
                    <TrendingUp className='h-4 w-4' />
                    {job.packageLpa} LPA
                  </div>
                  <div className='flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground'>
                    <Clock className='h-4 w-4' />
                    {job.eligibility}
                  </div>
                  <div className={`flex items-center gap-2 text-sm transition-colors ${isDeadlinePassed ? 'text-red-500' : 'text-muted-foreground hover:text-foreground'}`}>
                    <Calendar className='h-4 w-4' />
                    {isDeadlinePassed ? 'Deadline passed' : `Apply by ${formatDate(job.deadline)}`}
                  </div>
                </CardContent>
                <CardFooter className='pt-2'>
                  <Button
                    className='w-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]'
                    onClick={() => handleApplyClick(job)}
                    disabled={hasApplied || !profile?.resumeUrl || isDeadlinePassed}
                    variant={hasApplied ? 'outline' : 'default'}
                  >
                    {hasApplied ? 'Already Applied' : !profile?.resumeUrl ? 'Upload Resume First' : isDeadlinePassed ? 'Expired' : 'Apply Now'}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Apply Dialog */}
      <Dialog open={applyDialogOpen} onOpenChange={setApplyDialogOpen}>
        <DialogContent className='sm:max-w-lg'>
          <DialogHeader>
            <DialogTitle>Apply to {selectedJob?.title}</DialogTitle>
            <DialogDescription>
              {selectedJob?.company.companyName} • {selectedJob?.location} • {selectedJob?.packageLpa} LPA
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div className='rounded-lg bg-muted p-4'>
              <div className='flex items-center gap-2 text-sm'>
                <Paperclip className='h-4 w-4' />
                <span className='font-medium'>Resume:</span>
                <a href={profile?.resumeUrl || '#'} target='_blank' rel='noreferrer' className='text-primary hover:underline'>
                  View uploaded resume
                </a>
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='coverLetter'>Cover Letter (Optional)</Label>
              <Textarea
                id='coverLetter'
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder='Tell the company why you are a good fit...'
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setApplyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitApplication} disabled={applyingJobId !== null}>
              {applyingJobId ? 'Applying...' : 'Submit Application'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
