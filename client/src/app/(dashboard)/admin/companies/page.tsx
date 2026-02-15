'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { MoreHorizontal, Plus, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

import { adminService, type CompanyDetails, type CompanySummary } from '@/services/admin-service';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const PAGE_LIMIT = 10;

export default function AdminCompaniesPage(): React.ReactElement {
  const [companies, setCompanies] = useState<CompanySummary[]>([]);
  const [pagination, setPagination] = useState<{ page: number; limit: number; total: number; totalPages: number } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<CompanySummary | null>(null);
  const [editForm, setEditForm] = useState({
    companyName: '',
    hrEmail: '',
    hrMobileNumber: '',
    isActive: true,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingCompanyId, setDeletingCompanyId] = useState<string | null>(null);
  const [deletingCompanyName, setDeletingCompanyName] = useState('');
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewCompany, setViewCompany] = useState<CompanyDetails | null>(null);
  const [viewLoading, setViewLoading] = useState(false);

  const [form, setForm] = useState({
    companyName: '',
    hrEmail: '',
    hrMobileNumber: '',
    website: '',
    industry: '',
    headquarters: '',
  });

  const fetchCompanies = useCallback(
    async (page = 1) => {
      setIsLoading(true);
      try {
        const response = await adminService.listCompanies(page, PAGE_LIMIT);
        setCompanies(response.items);
        setPagination(response.pagination);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to load companies');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchCompanies(currentPage);
  }, [currentPage, fetchCompanies]);

  const onCreateCompany = async (): Promise<void> => {
    if (!form.companyName || !form.hrEmail || !form.hrMobileNumber) {
      toast.error('Company name, HR email, and mobile are required');
      return;
    }

    setIsCreating(true);
    try {
      await adminService.createCompany({
        companyName: form.companyName,
        hrEmail: form.hrEmail,
        hrMobileNumber: form.hrMobileNumber,
        website: form.website || undefined,
        industry: form.industry || undefined,
        headquarters: form.headquarters || undefined,
      });
      toast.success('Company created and credentials emailed');
      setDialogOpen(false);
      setForm({
        companyName: '',
        hrEmail: '',
        hrMobileNumber: '',
        website: '',
        industry: '',
        headquarters: '',
      });
      setCurrentPage(1);
      await fetchCompanies(1);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to create company');
    } finally {
      setIsCreating(false);
    }
  };

  const onToggleActivation = async (company: CompanySummary): Promise<void> => {
    setStatusUpdatingId(company._id);
    try {
      await adminService.updateCompanyStatus(company._id, !company.isActive);
      toast.success(`Company ${company.isActive ? 'deactivated' : 'activated'}`);
      fetchCompanies(currentPage);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to update status');
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const openViewDialog = async (company: CompanySummary): Promise<void> => {
    setViewDialogOpen(true);
    setViewLoading(true);
    try {
      const data = await adminService.getCompany(company._id);
      setViewCompany(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to load company details');
      setViewDialogOpen(false);
    } finally {
      setViewLoading(false);
    }
  };

  const openEditDialog = (company: CompanySummary) => {
    setEditingCompany(company);
    setEditForm({
      companyName: company.companyName,
      hrEmail: company.hrEmail,
      hrMobileNumber: company.hrMobileNumber,
      isActive: company.isActive,
    });
    setEditDialogOpen(true);
  };

  const handleEditSave = async (): Promise<void> => {
    if (!editingCompany) return;
    setIsEditing(true);
    try {
      await adminService.updateCompany(editingCompany._id, {
        companyName: editForm.companyName,
        hrEmail: editForm.hrEmail,
        hrMobileNumber: editForm.hrMobileNumber,
        isActive: editForm.isActive,
      });
      toast.success('Company details updated');
      setEditDialogOpen(false);
      fetchCompanies(currentPage);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to update company');
    } finally {
      setIsEditing(false);
    }
  };

  const openDeleteDialog = (company: CompanySummary) => {
    setDeletingCompanyId(company._id);
    setDeletingCompanyName(company.companyName);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async (): Promise<void> => {
    if (!deletingCompanyId) return;
    try {
      await adminService.deleteCompany(deletingCompanyId);
      toast.success('Company deleted');
      setDeleteDialogOpen(false);
      setDeletingCompanyId(null);
      fetchCompanies(currentPage);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to delete company');
    }
  };

  const paginationDisplay = useMemo(() => {
    if (!pagination) return 'Loading companies…';
    const start = (pagination.page - 1) * pagination.limit + 1;
    const end = Math.min(pagination.page * pagination.limit, pagination.total);
    return `Showing ${start}-${end} of ${pagination.total}`;
  }, [pagination]);

  return (
    <section className='space-y-6'>
      <div className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between'>
        <div>
          <h1 className='text-2xl font-semibold tracking-tight'>Company Management</h1>
          <p className='text-sm text-muted-foreground'>Create and manage company accounts with audit-ready workflows.</p>
        </div>
        <div className='flex items-center gap-2'>
          <Button variant='ghost' size='sm' className='gap-1' onClick={() => fetchCompanies(currentPage)} disabled={isLoading}>
            <RefreshCw className='h-4 w-4' />
            Refresh
          </Button>
          <Button className='gap-2' onClick={() => setDialogOpen(true)}>
            <Plus className='h-4 w-4' />
            Create Company
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className='flex flex-wrap items-center justify-between gap-2'>
          <div>
            <CardTitle>Companies</CardTitle>
            <CardDescription>{paginationDisplay}</CardDescription>
          </div>
          <Badge variant='outline' className='uppercase tracking-wide'>
            {companies.filter((item) => item.isActive).length} Active / {companies.length - companies.filter((item) => !item.isActive).length}{' '}
            Inactive
          </Badge>
        </CardHeader>
        <CardContent className='p-0'>
          <div className='rounded-b-md border-t border-t-border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>HR Email</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? Array.from({ length: PAGE_LIMIT }).map((_, index) => (
                      <TableRow key={`skeleton-${index}`} className='animate-pulse'>
                        {Array.from({ length: 5 }).map((__, cellIndex) => (
                          <TableCell key={cellIndex} className='h-6 bg-muted/40' />
                        ))}
                      </TableRow>
                    ))
                  : companies.map((company) => (
                      <TableRow key={company._id} className='transition-colors hover:bg-muted/40'>
                        <TableCell className='font-medium'>{company.companyName}</TableCell>
                        <TableCell>{company.hrEmail}</TableCell>
                        <TableCell>{company.hrMobileNumber}</TableCell>
                        <TableCell>
                          <Badge variant={company.isActive ? 'default' : 'secondary'}>{company.isActive ? 'Active' : 'Inactive'}</Badge>
                        </TableCell>
                        <TableCell className='text-right'>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant='outline' size='sm' className='h-9 w-9 p-0'>
                                <MoreHorizontal className='h-4 w-4' />
                                <span className='sr-only'>Open actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                              <DropdownMenuItem onClick={() => openViewDialog(company)}>View</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openEditDialog(company)}>Edit</DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => onToggleActivation(company)}
                                className={statusUpdatingId === company._id ? 'pointer-events-none opacity-50' : ''}
                              >
                                {company.isActive ? 'Disable company' : 'Enable company'}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className='text-destructive' onClick={() => openDeleteDialog(company)}>
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
              <Button variant='outline' size='sm' disabled={pagination.page <= 1} onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}>
                Previous
              </Button>
              <Button
                variant='outline'
                size='sm'
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(pagination.totalPages, prev + 1))}
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
            <DialogTitle>Create Company Account</DialogTitle>
            <DialogDescription>Admin/TPO generates company login credentials.</DialogDescription>
          </DialogHeader>
          <div className='space-y-3'>
            <div className='space-y-2'>
              <Label htmlFor='companyName'>Company Name</Label>
              <Input id='companyName' value={form.companyName} onChange={(event) => setForm((prev) => ({ ...prev, companyName: event.target.value }))} />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='hrEmail'>HR Email</Label>
              <Input id='hrEmail' type='email' value={form.hrEmail} onChange={(event) => setForm((prev) => ({ ...prev, hrEmail: event.target.value }))} />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='hrMobileNumber'>HR Mobile Number</Label>
              <Input
                id='hrMobileNumber'
                type='tel'
                value={form.hrMobileNumber}
                onChange={(event) => setForm((prev) => ({ ...prev, hrMobileNumber: event.target.value }))}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='website'>Website</Label>
              <Input id='website' value={form.website} onChange={(event) => setForm((prev) => ({ ...prev, website: event.target.value }))} />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='industry'>Industry</Label>
              <Input id='industry' value={form.industry} onChange={(event) => setForm((prev) => ({ ...prev, industry: event.target.value }))} />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='headquarters'>Headquarters</Label>
              <Input id='headquarters' value={form.headquarters} onChange={(event) => setForm((prev) => ({ ...prev, headquarters: event.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={onCreateCompany} disabled={isCreating}>
              {isCreating ? 'Creating…' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={viewDialogOpen} onOpenChange={(isOpen) => !isOpen && setViewCompany(null)}>
        <DialogTrigger asChild>
          <span />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Company details</DialogTitle>
            <DialogDescription>Current company information and activity.</DialogDescription>
          </DialogHeader>
          <div className='space-y-3 text-sm'>
            {viewLoading ? (
              <p className='text-muted-foreground'>Loading...</p>
            ) : (
              <>
                <p>
                  <span className='font-semibold text-foreground'>Name:</span> {viewCompany?.companyName}
                </p>
                <p>
                  <span className='font-semibold text-foreground'>HR Email:</span> {viewCompany?.hrEmail}
                </p>
                <p>
                  <span className='font-semibold text-foreground'>HR Mobile:</span> {viewCompany?.hrMobileNumber}
                </p>
                <p>
                  <span className='font-semibold text-foreground'>Status:</span> {viewCompany?.isActive ? 'Active' : 'Inactive'}
                </p>
                <p>
                  <span className='font-semibold text-foreground'>Jobs posted:</span> {viewCompany?.jobsPosted ?? 0}
                </p>
                <p>
                  <span className='font-semibold text-foreground'>Created:</span>{' '}
                  {viewCompany ? new Date(viewCompany.createdAt).toLocaleString() : ''}
                </p>
              </>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={(isOpen) => !isOpen && setEditingCompany(null)}>
        <DialogTrigger asChild>
          <span />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
            <DialogDescription>Update HR details and status.</DialogDescription>
          </DialogHeader>
          <div className='space-y-3'>
            <div className='space-y-2'>
              <Label htmlFor='editCompanyName'>Company Name</Label>
              <Input
                id='editCompanyName'
                value={editForm.companyName}
                onChange={(event) => setEditForm((prev) => ({ ...prev, companyName: event.target.value }))}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='editHrEmail'>HR Email</Label>
              <Input
                id='editHrEmail'
                type='email'
                value={editForm.hrEmail}
                onChange={(event) => setEditForm((prev) => ({ ...prev, hrEmail: event.target.value }))}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='editHrMobile'>HR Mobile Number</Label>
              <Input
                id='editHrMobile'
                type='tel'
                value={editForm.hrMobileNumber}
                onChange={(event) => setEditForm((prev) => ({ ...prev, hrMobileNumber: event.target.value }))}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='editIsActive'>Status</Label>
              <select
                id='editIsActive'
                className='w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
                value={editForm.isActive ? 'active' : 'inactive'}
                onChange={(event) =>
                  setEditForm((prev) => ({ ...prev, isActive: event.target.value === 'active' }))
                }
              >
                <option value='active'>Active</option>
                <option value='inactive'>Inactive</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSave} disabled={isEditing}>
              {isEditing ? 'Saving…' : 'Save changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={(isOpen) => !isOpen && setDeletingCompanyId(null)}>
        <DialogTrigger asChild>
          <span />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete company?</DialogTitle>
            <DialogDescription>Deleting a company removes it and its user. This cannot be undone.</DialogDescription>
          </DialogHeader>
          <div className='space-y-2 text-sm text-muted-foreground'>
            <p>
              Are you sure you want to delete <strong>{deletingCompanyName}</strong>?
            </p>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant='outline' className='text-destructive' onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
