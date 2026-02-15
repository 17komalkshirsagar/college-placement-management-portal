'use client';

import { useCallback, useEffect, useState } from 'react';
import { MessageSquare, RefreshCw, CheckCircle, Clock, XCircle } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api';

interface SupportMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'pending' | 'responded' | 'closed';
  createdAt: string;
  updatedAt: string;
}

export default function AdminSupportMessagesPage(): React.ReactElement {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<SupportMessage | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<SupportMessage | null>(null);
  const [newStatus, setNewStatus] = useState<'pending' | 'responded' | 'closed'>('pending');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${BACKEND_URL}/support`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      setMessages(data.data || []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const openViewDialog = (message: SupportMessage) => {
    setSelectedMessage(message);
    setViewDialogOpen(true);
  };

  const openStatusDialog = (message: SupportMessage) => {
    setStatusMessage(message);
    setNewStatus(message.status);
    setStatusDialogOpen(true);
  };

  const handleStatusUpdate = async () => {
    if (!statusMessage) return;
    setIsUpdatingStatus(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${BACKEND_URL}/support/${statusMessage._id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      toast.success('Status updated successfully');
      setStatusDialogOpen(false);
      fetchMessages();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant='outline' className='bg-yellow-50 text-yellow-700 border-yellow-200'>
            <Clock className='w-3 h-3 mr-1' />
            Pending
          </Badge>
        );
      case 'responded':
        return (
          <Badge variant='outline' className='bg-green-50 text-green-700 border-green-200'>
            <CheckCircle className='w-3 h-3 mr-1' />
            Responded
          </Badge>
        );
      case 'closed':
        return (
          <Badge variant='outline' className='bg-gray-50 text-gray-700 border-gray-200'>
            <XCircle className='w-3 h-3 mr-1' />
            Closed
          </Badge>
        );
      default:
        return <Badge variant='outline'>{status}</Badge>;
    }
  };

  const pendingCount = messages.filter((m) => m.status === 'pending').length;
  const respondedCount = messages.filter((m) => m.status === 'responded').length;
  const closedCount = messages.filter((m) => m.status === 'closed').length;

  return (
    <section className='space-y-6'>
      <div className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between'>
        <div>
          <h1 className='text-2xl font-semibold tracking-tight'>Support Messages</h1>
          <p className='text-sm text-muted-foreground'>View and manage user support inquiries.</p>
        </div>
        <div className='flex items-center gap-2'>
          <Button variant='ghost' size='sm' className='gap-1' onClick={fetchMessages} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className='grid gap-4 md:grid-cols-3'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Messages</CardTitle>
            <MessageSquare className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{messages.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Pending</CardTitle>
            <Clock className='h-4 w-4 text-yellow-500' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-yellow-600'>{pendingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Responded</CardTitle>
            <CheckCircle className='h-4 w-4 text-green-500' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-green-600'>{respondedCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Messages</CardTitle>
          <CardDescription>
            {messages.length === 0 ? 'No support messages yet' : `Showing ${messages.length} messages`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className='space-y-3'>
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className='h-16 animate-pulse rounded-md bg-muted/40' />
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-12 text-center'>
              <MessageSquare className='h-12 w-12 text-muted-foreground/50' />
              <p className='mt-4 text-sm text-muted-foreground'>No support messages yet</p>
            </div>
          ) : (
            <div className='space-y-3'>
              {messages.map((message) => (
                <div
                  key={message._id}
                  className='flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50'
                >
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-2'>
                      <p className='font-medium truncate'>{message.name}</p>
                      {getStatusBadge(message.status)}
                    </div>
                    <p className='text-sm text-muted-foreground truncate'>{message.subject}</p>
                    <p className='text-xs text-muted-foreground mt-1'>{message.email}</p>
                  </div>
                  <div className='flex items-center gap-2 ml-4'>
                    <p className='text-xs text-muted-foreground whitespace-nowrap'>
                      {new Date(message.createdAt).toLocaleDateString()}
                    </p>
                    <div className='flex gap-1'>
                      <Button variant='outline' size='sm' onClick={() => openViewDialog(message)}>
                        View
                      </Button>
                      <Button variant='ghost' size='sm' onClick={() => openStatusDialog(message)}>
                        Status
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={viewDialogOpen} onOpenChange={(isOpen) => !isOpen && setSelectedMessage(null)}>
        <DialogTrigger asChild>
          <span />
        </DialogTrigger>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
            <DialogDescription>
              Received on {selectedMessage ? new Date(selectedMessage.createdAt).toLocaleString() : ''}
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label className='text-muted-foreground'>Name</Label>
                <p className='font-medium'>{selectedMessage?.name}</p>
              </div>
              <div>
                <Label className='text-muted-foreground'>Email</Label>
                <p className='font-medium'>{selectedMessage?.email}</p>
              </div>
              <div className='col-span-2'>
                <Label className='text-muted-foreground'>Subject</Label>
                <p className='font-medium'>{selectedMessage?.subject}</p>
              </div>
              <div className='col-span-2'>
                <Label className='text-muted-foreground'>Message</Label>
                <div className='mt-1 rounded-md border bg-muted/50 p-4'>
                  <p className='whitespace-pre-wrap text-sm'>{selectedMessage?.message}</p>
                </div>
              </div>
              <div>
                <Label className='text-muted-foreground'>Status</Label>
                <div className='mt-1'>{selectedMessage && getStatusBadge(selectedMessage.status)}</div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={statusDialogOpen} onOpenChange={(isOpen) => !isOpen && setStatusMessage(null)}>
        <DialogTrigger asChild>
          <span />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Status</DialogTitle>
            <DialogDescription>Change the status of this support message.</DialogDescription>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <Label>Select Status</Label>
              <div className='flex gap-2'>
                <Button
                  variant={newStatus === 'pending' ? 'default' : 'outline'}
                  size='sm'
                  onClick={() => setNewStatus('pending')}
                  className={newStatus === 'pending' ? '' : 'text-yellow-600 border-yellow-300 hover:bg-yellow-50'}
                >
                  <Clock className='w-3 h-3 mr-1' />
                  Pending
                </Button>
                <Button
                  variant={newStatus === 'responded' ? 'default' : 'outline'}
                  size='sm'
                  onClick={() => setNewStatus('responded')}
                  className={newStatus === 'responded' ? '' : 'text-green-600 border-green-300 hover:bg-green-50'}
                >
                  <CheckCircle className='w-3 h-3 mr-1' />
                  Responded
                </Button>
                <Button
                  variant={newStatus === 'closed' ? 'default' : 'outline'}
                  size='sm'
                  onClick={() => setNewStatus('closed')}
                  className={newStatus === 'closed' ? '' : 'text-gray-600 border-gray-300 hover:bg-gray-50'}
                >
                  <XCircle className='w-3 h-3 mr-1' />
                  Closed
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleStatusUpdate} disabled={isUpdatingStatus}>
              {isUpdatingStatus ? 'Updating...' : 'Update Status'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
