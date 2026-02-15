'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Eye, Plus, RefreshCw, Trash2, UserCheck, UserMinus } from 'lucide-react';
import { toast } from 'sonner';

import { adminService, type PaginationPayload, type StudentSummary } from '@/services/admin-service';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const PAGE_LIMIT = 10;

export default function AdminStudentsPage(): React.ReactElement {
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [pagination, setPagination] = useState<PaginationPayload | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [detailStudent, setDetailStudent] = useState<StudentSummary | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailForm, setDetailForm] = useState({ course: '', branch: '', year: '' });
  const [detailLoading, setDetailLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    course: '',
    branch: '',
    year: 1,
  });

  const [filters, setFilters] = useState({
    course: 'all',
    branch: 'all',
    status: 'all',
    search: '',
  });

  const fetchStudents = useCallback(
    async (targetPage = 1) => {
      setIsLoading(true);
      try {
        const response = await adminService.listStudents(targetPage, PAGE_LIMIT);
        setStudents(response.items);
        setPagination(response.pagination);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Unable to load students');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchStudents(page);
  }, [fetchStudents, page]);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const searchable = [
        student.fullName ?? student.user.fullName ?? '',
        student.user.email,
        student.course,
        student.branch,
      ]
        .join(' ')
        .toLowerCase();
      const matchesSearch = searchable.includes(filters.search.toLowerCase());
      const matchesCourse = filters.course === 'all' || student.course === filters.course;
      const matchesBranch = filters.branch === 'all' || student.branch === filters.branch;
      const matchesStatus = filters.status === 'all' || student.user.status === filters.status;
      return matchesSearch && matchesCourse && matchesBranch && matchesStatus;
    });
  }, [students, filters]);

  const handleCreateStudent = async (): Promise<void> => {
    if (!form.fullName || !form.email || !form.mobileNumber || !form.course || !form.branch || !form.year) {
      toast.error('All fields are required');
      return;
    }

    setIsCreating(true);
    try {
      await adminService.createStudent({
        fullName: form.fullName,
        email: form.email,
        mobileNumber: form.mobileNumber,
        course: form.course,
        branch: form.branch,
        year: Number(form.year),
      });
      toast.success('Student account created and credentials emailed');
      setDialogOpen(false);
      setForm({ fullName: '', email: '', mobileNumber: '', course: '', branch: '', year: 1 });
      setPage(1);
      await fetchStudents(1);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create student');
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggleStatus = async (student: StudentSummary): Promise<void> => {
    try {
      await adminService.updateUserStatus(student.user._id, student.user.status === 'active' ? 'inactive' : 'active');
      toast.success('Student status updated');
      fetchStudents(page);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to update status');
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (!deleteId) return;
    try {
      await adminService.deleteStudent(deleteId);
      toast.success('Student removed');
      setDeleteId(null);
      fetchStudents(page);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to delete student');
    }
  };

  const openDetailDialog = (student: StudentSummary) => {
    setDetailStudent(student);
    setDetailForm({ course: student.course, branch: student.branch, year: student.year.toString() });
    setDetailOpen(true);
  };

  const handleDetailSave = async (): Promise<void> => {
    if (!detailStudent) return;
    setDetailLoading(true);
    try {
      await adminService.updateStudentProfile(detailStudent._id, {
        course: detailForm.course,
        branch: detailForm.branch,
        year: Number(detailForm.year),
      });
      toast.success('Student profile updated');
      setDetailOpen(false);
      fetchStudents(page);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to save changes');
    } finally {
      setDetailLoading(false);
    }
  };

  const paginationLabel = useMemo(() => {
    if (!pagination) return 'Loading students…';
    const start = (pagination.page - 1) * pagination.limit + 1;
    const end = Math.min(pagination.page * pagination.limit, pagination.total);
    return `Showing ${start}-${end} of ${pagination.total}`;
  }, [pagination]);

  return (
    <section className='space-y-6'>
      <div className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between'>
        <div>
          <h1 className='text-2xl font-semibold tracking-tight'>Student Management</h1>
          <p className='text-sm text-muted-foreground'>Register students and keep application status transparent.</p>
        </div>
        <div className='flex items-center gap-2'>
          <Button variant='ghost' size='sm' className='gap-1' onClick={() => fetchStudents(page)} disabled={isLoading}>
            <RefreshCw className='h-4 w-4' />
            Refresh
          </Button>
          <Button className='gap-2' onClick={() => setDialogOpen(true)}>
            <Plus className='h-4 w-4' />
            Create Student
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className='flex flex-wrap items-center justify-between gap-3'>
          <div>
            <CardTitle>Students</CardTitle>
            <CardDescription>{paginationLabel}</CardDescription>
          </div>
          <div className='flex flex-wrap gap-2'>
            <Input
              placeholder='Search name, email, branch'
              value={filters.search}
              onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
              className='md:min-w-[220px]'
            />
            <Button variant={filters.status === 'all' ? undefined : 'outline'} size='sm' onClick={() => setFilters((prev) => ({ ...prev, status: 'all' }))}>
              All
            </Button>
            <Button
              variant={filters.status === 'active' ? undefined : 'outline'}
              size='sm'
              onClick={() => setFilters((prev) => ({ ...prev, status: 'active' }))}
            >
              Active
            </Button>
            <Button
              variant={filters.status === 'inactive' ? undefined : 'outline'}
              size='sm'
              onClick={() => setFilters((prev) => ({ ...prev, status: 'inactive' }))}
            >
              Inactive
            </Button>
          </div>
        </CardHeader>
        <CardContent className='p-0'>
          <div className='rounded-b-md border-t border-t-border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? Array.from({ length: PAGE_LIMIT }).map((_, index) => (
                      <TableRow key={`loading-${index}`} className='animate-pulse'>
                        {Array.from({ length: 6 }).map((__, idx) => (
                          <TableCell key={idx} className='h-6 bg-muted/40' />
                        ))}
                      </TableRow>
                    ))
                  : filteredStudents.map((student) => (
                      <TableRow key={student._id} className='transition-colors hover:bg-muted/40'>
                        <TableCell className='font-medium'>{student.fullName ?? student.user.fullName}</TableCell>
                        <TableCell>{student.user.email}</TableCell>
                        <TableCell>{student.course}</TableCell>
                        <TableCell>{student.branch}</TableCell>
                        <TableCell>
                          <Badge variant={student.user.status === 'active' ? 'default' : 'secondary'}>{student.user.status}</Badge>
                        </TableCell>
                        <TableCell className='text-right'>
                          <div className='inline-flex items-center gap-2'>
                            <Button variant='outline' size='sm' onClick={() => openDetailDialog(student)} className='gap-1'>
                              <Eye className='h-4 w-4' />
                              <span className='sr-only'>View details</span>
                            </Button>
                            <Button variant='outline' size='sm' onClick={() => handleToggleStatus(student)} className='gap-1'>
                              {student.user.status === 'active' ? <UserMinus className='h-4 w-4' /> : <UserCheck className='h-4 w-4' />}
                              {student.user.status === 'active' ? 'Deactivate' : 'Make active'}
                            </Button>
                            <Button variant='outline' size='sm' onClick={() => setDeleteId(student._id)}>
                              <Trash2 className='h-4 w-4' />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        {pagination && (
          <CardFooter className='flex flex-wrap items-center justify-between gap-3 rounded-b-md border-t border-border px-4 py-3 text-sm text-muted-foreground'>
            <span>{`Page ${pagination.page} of ${pagination.totalPages}`}</span>
            <div className='inline-flex items-center gap-2'>
              <Button variant='outline' size='sm' disabled={pagination.page <= 1} onClick={() => setPage((prev) => Math.max(1, prev - 1))}>
                Previous
              </Button>
              <Button
                variant='outline'
                size='sm'
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPage((prev) => Math.min(pagination.totalPages, prev + 1))}
              >
                Next
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <span />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Student Account</DialogTitle>
            <DialogDescription>Admin generates login credentials for a new student.</DialogDescription>
          </DialogHeader>
          <div className='space-y-3'>
            <div className='space-y-2'>
              <Label htmlFor='fullName'>Full Name</Label>
              <Input id='fullName' value={form.fullName} onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))} />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input id='email' type='email' value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='mobileNumber'>Mobile Number</Label>
              <Input id='mobileNumber' type='tel' value={form.mobileNumber} onChange={(event) => setForm((prev) => ({ ...prev, mobileNumber: event.target.value }))} />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='course'>Course</Label>
              <Input id='course' value={form.course} onChange={(event) => setForm((prev) => ({ ...prev, course: event.target.value }))} />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='branch'>Branch</Label>
              <Input id='branch' value={form.branch} onChange={(event) => setForm((prev) => ({ ...prev, branch: event.target.value }))} />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='year'>Year</Label>
              <Input id='year' type='number' min={1} max={6} value={form.year} onChange={(event) => setForm((prev) => ({ ...prev, year: Number(event.target.value) }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateStudent} disabled={isCreating}>
              {isCreating ? 'Creating…' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={detailOpen} onOpenChange={(open) => !open && setDetailStudent(null)}>
        <DialogTrigger asChild>
          <span />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Student profile</DialogTitle>
            <DialogDescription>Review and update course, branch or year.</DialogDescription>
          </DialogHeader>
          <div className='space-y-3'>
            <div className='space-y-1 text-sm text-muted-foreground'>
              <p>
                <span className='font-semibold text-foreground'>Name:</span> {detailStudent?.fullName ?? detailStudent?.user.fullName}
              </p>
              <p>
                <span className='font-semibold text-foreground'>Email:</span> {detailStudent?.user.email}
              </p>
              <p>
                <span className='font-semibold text-foreground'>Status:</span>{' '}
                <span className='capitalize'>{detailStudent?.user.status ?? 'unknown'}</span>
              </p>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='detailCourse'>Course</Label>
              <Input
                id='detailCourse'
                value={detailForm.course}
                onChange={(event) => setDetailForm((prev) => ({ ...prev, course: event.target.value }))}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='detailBranch'>Branch</Label>
              <Input
                id='detailBranch'
                value={detailForm.branch}
                onChange={(event) => setDetailForm((prev) => ({ ...prev, branch: event.target.value }))}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='detailYear'>Year</Label>
              <Input
                id='detailYear'
                type='number'
                min={1}
                max={6}
                value={detailForm.year}
                onChange={(event) => setDetailForm((prev) => ({ ...prev, year: event.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setDetailOpen(false)}>
              Close
            </Button>
            <Button onClick={handleDetailSave} disabled={detailLoading}>
              {detailLoading ? 'Saving…' : 'Save changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(deleteId)} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogTrigger asChild>
          <span />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete student?</DialogTitle>
            <DialogDescription>This will remove the student from the portal.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
