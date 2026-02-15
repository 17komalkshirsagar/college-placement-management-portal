'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, Users, MapPin, DollarSign, Clock, X, Briefcase, Calendar, Loader2, Check, Eye } from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { companyService, type Job } from '@/services/company-service';

const formatDate = (value?: string): string =>
  value ? new Date(value).toLocaleDateString('en-IN', { dateStyle: 'medium' }) : '-';

const jobTypes = ['Full-time', 'Part-time', 'Internship', 'Contract'];
const experienceLevels = ['Fresher', '0-1 years', '1-2 years', '2-3 years', '3-5 years', '5+ years'];

export default function ManageJobsPage(): React.ReactElement {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [skill, setSkill] = useState('');
  const router = useRouter();

  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    location: '',
    packageLpa: '',
    eligibility: '',
    deadline: '',
    jobType: '',
    experienceRequired: '',
    skillsRequired: [] as string[],
    isActive: true,
  });

  const loadJobs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await companyService.listJobs(1, 50);
      setJobs(data.items);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to load jobs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const handleEditClick = (job: Job) => {
    setSelectedJob(job);
    setEditForm({
      title: job.title,
      description: job.description,
      location: job.location,
      packageLpa: job.packageLpa.toString(),
      eligibility: job.eligibility,
      deadline: job.deadline.split('T')[0],
      jobType: job.jobType || '',
      experienceRequired: job.experienceRequired || '',
      skillsRequired: job.skillsRequired || [],
      isActive: job.isActive,
    });
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (job: Job) => {
    setSelectedJob(job);
    setDeleteDialogOpen(true);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSkill = () => {
    if (skill.trim() && !editForm.skillsRequired.includes(skill.trim())) {
      setEditForm((prev) => ({
        ...prev,
        skillsRequired: [...prev.skillsRequired, skill.trim()],
      }));
      setSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setEditForm((prev) => ({
      ...prev,
      skillsRequired: prev.skillsRequired.filter((s) => s !== skillToRemove),
    }));
  };

  const handleSaveEdit = async () => {
    if (!selectedJob) return;

    setIsSaving(true);
    try {
      const deadlineISO = new Date(editForm.deadline + 'T23:59:59.999Z').toISOString();
      await companyService.updateJob(selectedJob._id, {
        title: editForm.title.trim(),
        description: editForm.description.trim(),
        location: editForm.location.trim(),
        packageLpa: Number(editForm.packageLpa),
        eligibility: editForm.eligibility.trim(),
        deadline: deadlineISO,
        jobType: editForm.jobType || undefined,
        experienceRequired: editForm.experienceRequired || undefined,
        skillsRequired: editForm.skillsRequired.length > 0 ? editForm.skillsRequired : undefined,
        isActive: editForm.isActive,
      });
      toast.success('Job updated successfully');
      setEditDialogOpen(false);
      loadJobs();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update job');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedJob) return;

    setIsDeleting(true);
    try {
      await companyService.deleteJob(selectedJob._id);
      toast.success('Job deleted successfully');
      setDeleteDialogOpen(false);
      loadJobs();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete job');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (job: Job) => {
    try {
      if (job.isActive) {
        await companyService.closeJob(job._id);
        toast.success('Job closed');
      } else {
        await companyService.updateJob(job._id, { isActive: true });
        toast.success('Job reopened');
      }
      loadJobs();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update job status');
    }
  };

  if (loading && jobs.length === 0) {
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
      {/* Header */}
      <Card className='border-l-4 border-l-primary shadow-md overflow-hidden relative'>
        <div className='absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none' />
        <CardContent className='pt-6'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <h1 className='text-2xl font-bold'>Manage Jobs</h1>
              <p className='text-muted-foreground'>View, edit, and manage your job postings</p>
            </div>
            <Button asChild className='transition-transform hover:scale-105 active:scale-95'>
              <Link href='/company/post-job'>
                <Plus className='mr-2 h-4 w-4' />
                Post New Job
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Jobs Grid */}
      {jobs.length === 0 ? (
        <Card className='shadow-md'>
          <CardContent className='flex flex-col items-center justify-center py-16 text-center'>
            <Briefcase className='mb-4 h-16 w-16 text-muted-foreground' />
            <p className='text-xl font-medium'>No jobs posted yet</p>
            <p className='text-muted-foreground'>Post your first job to start receiving applications</p>
            <Button className='mt-4' asChild>
              <Link href='/company/post-job'>Post a Job</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {jobs.map((job, index) => (
            <Card 
              key={job._id} 
              className='shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-default'
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
                  <Badge variant={job.isActive ? 'default' : 'secondary'} className='shrink-0'>
                    {job.isActive ? 'Active' : 'Closed'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='space-y-3 pt-0'>
                <div className='flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground'>
                  <MapPin className='h-4 w-4' />
                  {job.location}
                </div>
                <div className='flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground'>
                  <DollarSign className='h-4 w-4' />
                  {job.packageLpa} LPA
                </div>
                <div className='flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground'>
                  <Clock className='h-4 w-4' />
                  {job.eligibility}
                </div>
                <div className='flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground'>
                  <Calendar className='h-4 w-4' />
                  Deadline: {formatDate(job.deadline)}
                </div>
                {job.skillsRequired && job.skillsRequired.length > 0 && (
                  <div className='flex flex-wrap gap-1 pt-1'>
                    {job.skillsRequired.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant='outline' className='text-xs'>
                        {skill}
                      </Badge>
                    ))}
                    {job.skillsRequired.length > 3 && (
                      <Badge variant='secondary' className='text-xs'>
                        +{job.skillsRequired.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
              <CardContent className='pt-0'>
                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                  <Users className='h-4 w-4' />
                  <span>View applications in Applications page</span>
                </div>
              </CardContent>
              <CardContent className='flex gap-2 pt-0'>
                <Button
                  variant='outline'
                  size='sm'
                  className='flex-1 transition-all hover:scale-105'
                  onClick={() => handleEditClick(job)}
                >
                  <Pencil className='mr-2 h-4 w-4' />
                  Edit
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  className='flex-1 transition-all hover:scale-105'
                  onClick={() => handleToggleStatus(job)}
                >
                  {job.isActive ? (
                    <>
                      <X className='mr-2 h-4 w-4' />
                      Close
                    </>
                  ) : (
                    <>
                      <Check className='mr-2 h-4 w-4' />
                      Reopen
                    </>
                  )}
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  className='transition-all hover:scale-105'
                  onClick={() => router.push('/company/applications')}
                >
                  <Eye className='h-4 w-4' />
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  className='text-destructive hover:text-destructive transition-all hover:scale-105'
                  onClick={() => handleDeleteClick(job)}
                >
                  <Trash2 className='h-4 w-4' />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Edit Job</DialogTitle>
            <DialogDescription>Update the job details</DialogDescription>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <div className='grid gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='edit-title'>Job Title</Label>
                <Input
                  id='edit-title'
                  value={editForm.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='edit-location'>Location</Label>
                <Input
                  id='edit-location'
                  value={editForm.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='edit-package'>Package (LPA)</Label>
                <Input
                  id='edit-package'
                  type='number'
                  value={editForm.packageLpa}
                  onChange={(e) => handleInputChange('packageLpa', e.target.value)}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='edit-deadline'>Deadline</Label>
                <Input
                  id='edit-deadline'
                  type='date'
                  value={editForm.deadline}
                  onChange={(e) => handleInputChange('deadline', e.target.value)}
                />
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='edit-description'>Description</Label>
              <Textarea
                id='edit-description'
                value={editForm.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='edit-eligibility'>Eligibility</Label>
              <Textarea
                id='edit-eligibility'
                value={editForm.eligibility}
                onChange={(e) => handleInputChange('eligibility', e.target.value)}
                rows={2}
              />
            </div>
            <div className='space-y-2'>
              <Label>Skills Required</Label>
              <div className='flex items-center gap-2'>
                <Input
                  placeholder='Add a skill'
                  value={skill}
                  onChange={(e) => setSkill(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                />
                <Button type='button' onClick={handleAddSkill} size='sm'>
                  <Plus className='h-4 w-4' />
                </Button>
              </div>
              {editForm.skillsRequired.length > 0 && (
                <div className='mt-2 flex flex-wrap gap-2'>
                  {editForm.skillsRequired.map((s) => (
                    <Badge key={s} variant='secondary' className='flex items-center gap-1'>
                      {s}
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        className='h-3 w-3 p-0 hover:bg-transparent'
                        onClick={() => handleRemoveSkill(s)}
                      >
                        <X className='h-3 w-3' />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={isSaving}>
              {isSaving && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Job</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedJob?.title}"? This action cannot be undone and will remove all associated applications.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              {isDeleting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
