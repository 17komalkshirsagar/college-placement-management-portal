'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X, Briefcase, MapPin, DollarSign, Clock, GraduationCap, Code, Calendar, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

import { companyService } from '@/services/company-service';

const jobTypes = ['Full-time', 'Part-time', 'Internship', 'Contract'];
const experienceLevels = ['Fresher', '0-1 years', '1-2 years', '2-3 years', '3-5 years', '5+ years'];

export default function PostJobPage(): React.ReactElement {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skill, setSkill] = useState('');
  const router = useRouter();

  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    packageLpa: '',
    eligibility: '',
    deadline: '',
    jobType: '',
    experienceRequired: '',
    skillsRequired: [] as string[],
  });

  const handleInputChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSkill = () => {
    if (skill.trim() && !form.skillsRequired.includes(skill.trim())) {
      setForm((prev) => ({
        ...prev,
        skillsRequired: [...prev.skillsRequired, skill.trim()],
      }));
      setSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setForm((prev) => ({
      ...prev,
      skillsRequired: prev.skillsRequired.filter((s) => s !== skillToRemove),
    }));
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error('Job title is required');
      return;
    }
    if (!form.description.trim()) {
      toast.error('Job description is required');
      return;
    }
    if (!form.location.trim()) {
      toast.error('Location is required');
      return;
    }
    if (!form.packageLpa) {
      toast.error('Package/Salary is required');
      return;
    }
    if (!form.eligibility.trim()) {
      toast.error('Eligibility is required');
      return;
    }
    if (!form.deadline) {
      toast.error('Application deadline is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const deadlineISO = new Date(form.deadline + 'T23:59:59.999Z').toISOString();
      await companyService.createJob({
        title: form.title.trim(),
        description: form.description.trim(),
        location: form.location.trim(),
        packageLpa: Number(form.packageLpa),
        eligibility: form.eligibility.trim(),
        deadline: deadlineISO,
        jobType: form.jobType || undefined,
        experienceRequired: form.experienceRequired || undefined,
        skillsRequired: form.skillsRequired.length > 0 ? form.skillsRequired : undefined,
      });
      toast.success('Job posted successfully!');
      router.push('/company/manage-jobs');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to post job');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <Card className='border-l-4 border-l-primary shadow-md overflow-hidden relative'>
        <div className='absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none' />
        <CardContent className='pt-6'>
          <div className='flex items-center gap-3'>
            <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-transform hover:scale-110'>
              <Plus className='h-6 w-6 text-primary' />
            </div>
            <div>
              <h1 className='text-2xl font-bold'>Post New Job</h1>
              <p className='text-muted-foreground'>Create a new job posting to attract candidates</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form */}
      <Card className='shadow-md transition-all duration-300 hover:shadow-xl'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Briefcase className='h-5 w-5 text-primary' />
            Job Details
          </CardTitle>
          <CardDescription>Fill in the job information to create a new posting</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='grid gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='title'>
                  Job Title <span className='text-destructive'>*</span>
                </Label>
                <div className='relative'>
                  <Briefcase className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                  <Input
                    id='title'
                    placeholder='e.g., Software Developer'
                    value={form.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className='pl-9 transition-all focus:ring-2 focus:ring-primary'
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='location'>
                  Location <span className='text-destructive'>*</span>
                </Label>
                <div className='relative'>
                  <MapPin className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                  <Input
                    id='location'
                    placeholder='e.g., Mumbai, Pune, Remote'
                    value={form.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className='pl-9 transition-all focus:ring-2 focus:ring-primary'
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='package'>
                  Package (LPA) <span className='text-destructive'>*</span>
                </Label>
                <div className='relative'>
                  <DollarSign className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                  <Input
                    id='package'
                    type='number'
                    placeholder='e.g., 5'
                    value={form.packageLpa}
                    onChange={(e) => handleInputChange('packageLpa', e.target.value)}
                    className='pl-9 transition-all focus:ring-2 focus:ring-primary'
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='jobType'>Job Type</Label>
                <Select value={form.jobType} onValueChange={(value) => handleInputChange('jobType', value)}>
                  <SelectTrigger className='transition-all focus:ring-2 focus:ring-primary'>
                    <SelectValue placeholder='Select job type' />
                  </SelectTrigger>
                  <SelectContent>
                    {jobTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='experience'>Experience Required</Label>
                <Select value={form.experienceRequired} onValueChange={(value) => handleInputChange('experienceRequired', value)}>
                  <SelectTrigger className='transition-all focus:ring-2 focus:ring-primary'>
                    <SelectValue placeholder='Select experience level' />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='deadline'>
                  Application Deadline <span className='text-destructive'>*</span>
                </Label>
                <div className='relative'>
                  <Calendar className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                  <Input
                    id='deadline'
                    type='date'
                    value={form.deadline}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                    className='pl-9 transition-all focus:ring-2 focus:ring-primary'
                  />
                </div>
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='description'>
                Job Description <span className='text-destructive'>*</span>
              </Label>
              <Textarea
                id='description'
                placeholder='Describe the job role, responsibilities, and requirements...'
                value={form.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={5}
                className='transition-all focus:ring-2 focus:ring-primary'
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='eligibility'>
                Eligibility Criteria <span className='text-destructive'>*</span>
              </Label>
              <div className='relative'>
                <GraduationCap className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                <Textarea
                  id='eligibility'
                  placeholder='e.g., B.Sc. Computer Science, B.E. IT (Any year)'
                  value={form.eligibility}
                  onChange={(e) => handleInputChange('eligibility', e.target.value)}
                  rows={3}
                  className='pl-9 transition-all focus:ring-2 focus:ring-primary'
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label>Skills Required</Label>
              <div className='flex items-center gap-2'>
                <div className='relative flex-1'>
                  <Code className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                  <Input
                    placeholder='Add a skill (e.g., Python, React)'
                    value={skill}
                    onChange={(e) => setSkill(e.target.value)}
                    onKeyDown={handleSkillKeyDown}
                    className='pl-9 transition-all focus:ring-2 focus:ring-primary'
                  />
                </div>
                <Button
                  type='button'
                  onClick={handleAddSkill}
                  disabled={!skill.trim()}
                  className='transition-transform hover:scale-105'
                >
                  <Plus className='h-4 w-4' />
                </Button>
              </div>
              {form.skillsRequired.length > 0 && (
                <div className='mt-3 flex flex-wrap gap-2'>
                  {form.skillsRequired.map((s) => (
                    <Badge
                      key={s}
                      variant='secondary'
                      className='flex items-center gap-1 pr-1 transition-all hover:scale-105 cursor-default'
                    >
                      {s}
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        className='h-4 w-4 shrink-0 hover:bg-transparent hover:text-destructive'
                        onClick={() => handleRemoveSkill(s)}
                      >
                        <X className='h-3 w-3' />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className='flex justify-end gap-3 pt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => router.back()}
                className='transition-all hover:scale-105'
              >
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={isSubmitting}
                className='transition-all hover:scale-105'
              >
                {isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                {isSubmitting ? 'Posting...' : 'Post Job'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
