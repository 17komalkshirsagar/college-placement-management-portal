'use client';

import { type ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Shield, Upload, User, X } from 'lucide-react';

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
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

import { studentService, type StudentProfile } from '@/services/student-service';

const formatDateTime = (value?: string | null): string =>
  value ? new Date(value).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'Not uploaded yet';

export default function StudentProfilePage(): React.ReactElement {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isResumeBusy, setIsResumeBusy] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [newSkill, setNewSkill] = useState('');
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState({
    mobileNumber: '',
    course: '',
    branch: '',
    year: '1',
  });

  const loadProfile = useCallback(async () => {
    setLoading(true);
    try {
      const data = await studentService.getMyProfile();
      setProfile(data);
      setForm({
        mobileNumber: data.mobileNumber,
        course: data.course,
        branch: data.branch,
        year: data.year.toString(),
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to load profile data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleSaveProfile = async (): Promise<void> => {
    if (!profile) return;
    setIsSaving(true);
    try {
      const payload = {
        mobileNumber: form.mobileNumber.trim(),
        course: form.course.trim(),
        branch: form.branch.trim(),
        year: Number(form.year),
      };
      const updated = await studentService.updateProfile(profile._id, payload);
      setProfile(updated);
      toast.success('Profile saved successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResumeChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (!file) return;
    setResumeFile(file);
  };

  const handleUploadResume = async (): Promise<void> => {
    if (!profile) return;

    if (!resumeFile) {
      fileInputRef.current?.click();
      toast.error('Please choose a PDF before uploading');
      return;
    }

    if (resumeFile.type !== 'application/pdf') {
      toast.error('Only PDF resumes are allowed');
      return;
    }

    setIsResumeBusy(true);
    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      const updated = await studentService.uploadResume(profile._id, formData);
      setProfile(updated);
      setResumeFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      toast.success('Resume uploaded successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Resume upload failed');
    } finally {
      setIsResumeBusy(false);
    }
  };

  const handleDeleteResume = async (): Promise<void> => {
    if (!profile?.resumeUrl) {
      toast.error('No resume to remove');
      return;
    }

    setIsResumeBusy(true);
    try {
      const updated = await studentService.deleteResume(profile._id);
      setProfile(updated);
      toast.success('Resume removed');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to remove resume');
    } finally {
      setIsResumeBusy(false);
    }
  };

  const handleDeleteProfile = async (): Promise<void> => {
    if (!profile) return;
    setIsDeleting(true);
    try {
      await studentService.deleteMyProfile();
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      document.cookie = 'app_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      toast.success('Account deleted');
      window.location.href = '/login';
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to delete profile');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddSkill = async (): Promise<void> => {
    if (!profile || !newSkill.trim()) return;
    setIsAddingSkill(true);
    try {
      const updated = await studentService.addSkill(profile._id, newSkill.trim());
      setProfile(updated);
      setNewSkill('');
      toast.success('Skill added successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add skill');
    } finally {
      setIsAddingSkill(false);
    }
  };

  const handleRemoveSkill = async (skill: string): Promise<void> => {
    if (!profile) return;
    try {
      const updated = await studentService.removeSkill(profile._id, skill);
      setProfile(updated);
      toast.success('Skill removed');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to remove skill');
    }
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const resumeTimestamp = useMemo(() => formatDateTime(profile?.resumeUpdatedAt), [profile?.resumeUpdatedAt]);
  const badgeVariant = profile?.user.status === 'active' ? 'default' : 'destructive';

  if (loading && !profile) {
    return (
      <section className='flex min-h-[60vh] items-center justify-center'>
        <div className='flex flex-col items-center gap-2'>
          <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent'></div>
          <p className='text-sm text-muted-foreground'>Loading your profile...</p>
        </div>
      </section>
    );
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold'>My Profile</h1>
        <p className='text-muted-foreground'>Manage your personal information and resume</p>
      </div>

      <div className='grid gap-6 lg:grid-cols-[350px_1fr]'>
        {/* Profile Card */}
        <Card className='shadow-md transition-all duration-300 hover:shadow-xl'>
          <CardHeader className='text-center'>
            <div className='mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 transition-transform hover:scale-110'>
              <User className='h-12 w-12 text-primary' />
            </div>
            <CardTitle className='text-xl transition-colors hover:text-primary'>{profile?.user.fullName}</CardTitle>
            <CardDescription>{profile?.user.email}</CardDescription>
            <Badge variant={badgeVariant} className='mt-2 w-fit self-center capitalize transition-transform hover:scale-105'>
              {profile?.user.status}
            </Badge>
          </CardHeader>
          <CardContent className='space-y-4'>
            <Separator />
            <div className='space-y-3'>
              {[
                { label: 'Mobile', value: profile?.mobileNumber || '—' },
                { label: 'Course', value: profile?.course || '—' },
                { label: 'Branch', value: profile?.branch || '—' },
                { label: 'Year', value: profile?.year || '—' },
              ].map((item, index) => (
                <div key={item.label} className='flex items-center justify-between text-sm transition-colors hover:bg-muted/50 p-2 -mx-2 rounded'>
                  <span className='text-muted-foreground'>{item.label}</span>
                  <span className='font-medium'>{item.value}</span>
                </div>
              ))}
            </div>

            <Separator />

            {/* Skills Section */}
            <div>
              <h3 className='mb-3 text-sm font-medium transition-colors hover:text-primary'>Skills</h3>
              <div className='flex flex-wrap gap-2'>
                {profile?.skills && profile.skills.length > 0 ? (
                  profile.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant='secondary'
                      className='flex items-center gap-1 pr-1 transition-all hover:scale-105 cursor-default'
                    >
                      {skill}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 shrink-0 hover:bg-transparent hover:text-destructive transition-colors"
                        onClick={() => handleRemoveSkill(skill)}
                      >
                        <X className="h-3 w-3" />
                      </Button>

                    </Badge>
                  ))
                ) : (
                  <p className='text-xs text-muted-foreground'>No skills added yet</p>
                )}
              </div>
              <div className='mt-3 flex gap-2'>
                <Input
                  placeholder='Add a skill'
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  className='h-9 text-sm transition-all focus:ring-2 focus:ring-primary'
                />
                <Button
                  size='sm'
                  onClick={handleAddSkill}
                  disabled={isAddingSkill || !newSkill.trim()}
                  className='h-9 transition-all hover:scale-105'
                >
                  <Plus className='h-4 w-4' />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile & Resume */}
        <div className='space-y-6'>
          {/* Personal Information */}
          <Card className='shadow-md transition-all duration-300 hover:shadow-xl'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <User className='h-5 w-5 text-primary' />
                Personal Information
              </CardTitle>
              <CardDescription>Update your contact and academic details</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid gap-4 md:grid-cols-2'>
                <div className='space-y-2'>
                  <Label htmlFor='mobile'>Mobile Number</Label>
                  <Input
                    id='mobile'
                    value={form.mobileNumber}
                    onChange={(event) => setForm((prev) => ({ ...prev, mobileNumber: event.target.value }))}
                    placeholder='Enter mobile number'
                    className='transition-all focus:ring-2 focus:ring-primary'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='email'>Email</Label>
                  <Input id='email' value={profile?.user.email || ''} disabled className='bg-muted' />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='course'>Course</Label>
                  <Input
                    id='course'
                    value={form.course}
                    onChange={(event) => setForm((prev) => ({ ...prev, course: event.target.value }))}
                    placeholder='e.g., B.Sc. Computer Science'
                    className='transition-all focus:ring-2 focus:ring-primary'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='branch'>Branch</Label>
                  <Input
                    id='branch'
                    value={form.branch}
                    onChange={(event) => setForm((prev) => ({ ...prev, branch: event.target.value }))}
                    placeholder='e.g., Computer Science'
                    className='transition-all focus:ring-2 focus:ring-primary'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='year'>Year</Label>
                  <Input
                    id='year'
                    type='number'
                    min={1}
                    max={6}
                    value={form.year}
                    onChange={(event) => setForm((prev) => ({ ...prev, year: event.target.value }))}
                    className='transition-all focus:ring-2 focus:ring-primary'
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className='flex justify-end gap-2'>
              <Button variant='outline' onClick={loadProfile} disabled={loading} className='transition-all hover:scale-105'>
                Reset
              </Button>
              <Button onClick={handleSaveProfile} disabled={isSaving} className='transition-all hover:scale-105'>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>

          {/* Resume Upload */}
          <Card className='shadow-md transition-all duration-300 hover:shadow-xl'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Upload className='h-5 w-5 text-primary' />
                Resume
              </CardTitle>
              <CardDescription>Upload your resume in PDF format (recruiters will download this)</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between rounded-lg border p-4 transition-all hover:bg-muted/50 cursor-default'>
                <div className='flex items-center gap-3'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-transform hover:scale-110'>
                    <Upload className='h-6 w-6 text-primary' />
                  </div>
                  <div>
                    <p className='font-medium'>Resume Status</p>
                    <p className='text-sm text-muted-foreground'>{resumeTimestamp}</p>
                  </div>
                </div>
                {profile?.resumeUrl && (
                  <Button variant='outline' size='sm' asChild className='transition-all hover:scale-105'>
                    <a href={profile.resumeUrl} target='_blank' rel='noreferrer'>
                      View Resume
                    </a>
                  </Button>
                )}
              </div>

              <div className='space-y-2'>
                <Label>Upload New Resume</Label>
                <div className='flex items-center gap-3'>
                  <input
                    ref={fileInputRef}
                    className='sr-only'
                    type='file'
                    accept='application/pdf'
                    onChange={handleResumeChange}
                  />
                  <Button variant='outline' onClick={() => fileInputRef.current?.click()} className='transition-all hover:scale-105'>
                    Choose PDF
                  </Button>
                  <span className='text-sm text-muted-foreground transition-all'>
                    {resumeFile ? resumeFile.name : 'No file selected'}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className='flex justify-between'>
              <Button
                variant="ghost"
                onClick={handleDeleteResume}
                disabled={isResumeBusy || !profile?.resumeUrl}
                className="
    bg-red-500/10
    text-red-600
    hover:bg-red-500/20
    hover:text-red-700
    active:bg-red-500/30
    focus:bg-red-500/20
    transition-all
    hover:scale-105
  "
              >
                Remove Resume
              </Button>

              <Button onClick={handleUploadResume} disabled={isResumeBusy} className='transition-all hover:scale-105'>
                {isResumeBusy ? 'Uploading...' : 'Upload Resume'}
              </Button>
            </CardFooter>
          </Card>

          {/* Danger Zone */}
          <Card className='border-destructive/50 shadow-md transition-all duration-300 hover:shadow-xl'>
            <CardHeader>
              <CardTitle className='text-destructive flex items-center gap-2'>
                <Shield className='h-5 w-5' />
                Danger Zone
              </CardTitle>
              <CardDescription>Irreversible actions for your account</CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-end">
              <Button
                onClick={() => setDeleteDialogOpen(true)}
                className="
      bg-red-500/10 
      text-red-600 
      hover:bg-red-500/20 
      hover:text-red-700
      px-6 
      py-2 
      rounded-md 
      transition-all 
      hover:scale-105
    "
              >
                Delete Account
              </Button>
            </CardFooter>

          </Card>
        </div>
      </div>


      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              This action will permanently deactivate your placement portal account. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='gap-2'>
            <Button variant='outline' onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="ghost"
              onClick={handleDeleteProfile}
              disabled={isDeleting}
              className="
    bg-red-500/10
    text-red-600
    hover:bg-red-500/20
    hover:text-red-700
    transition-all
  "
            >
              {isDeleting ? "Deleting..." : "Delete Account"}
            </Button>

          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
