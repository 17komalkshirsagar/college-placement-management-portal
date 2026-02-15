'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Headphones, Mail, Phone, MapPin, Clock, Send, MessageSquare, User, FileQuestion } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { apiClient } from '@/api/base-api';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api';

export default function HelpSupportPage(): React.ReactElement {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${BACKEND_URL}/support`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to send message' }));
        throw new Error(errorData.message || 'Failed to send message');
      }

      toast.success('Your message has been sent. We will get back to you within 24-48 hours.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen bg-background'>
      <div className='container mx-auto max-w-4xl py-8 md:py-12'>
        <div className='mb-6'>
          <Link
            href='/'
            className='inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground'
          >
            <ArrowLeft className='h-4 w-4' />
            Back to Home
          </Link>
        </div>

        <div className='grid gap-8 lg:grid-cols-2'>
          <Card>
            <CardHeader className='space-y-4'>
              <div className='flex items-center gap-3'>
                <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10'>
                  <Headphones className='h-6 w-6 text-primary' />
                </div>
                <div>
                  <CardTitle className='text-2xl'>Help & Support</CardTitle>
                  <CardDescription>We are here to assist you</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className='space-y-6'>
              <p className='text-sm text-muted-foreground'>
                Welcome to the Vasantrao Naik Mahavidyalaya Placement Support Center. 
                Our dedicated team is available to help students, companies, and administrators 
                with any queries related to the placement portal.
              </p>

              <Separator />

              <div className='space-y-4'>
                <h3 className='font-semibold'>Contact Information</h3>
                <div className='grid gap-4'>
                  <div className='flex items-start gap-3 rounded-lg border bg-card p-3'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30'>
                      <MapPin className='h-5 w-5 text-blue-600' />
                    </div>
                    <div>
                      <p className='font-medium text-sm'>Visit Us</p>
                      <p className='text-sm text-muted-foreground'>
                        Placement Cell, Vasantrao Naik Mahavidyalaya<br />
                        Airport Road, Cidco<br />
                        Aurangabad, Maharashtra - 431001
                      </p>
                    </div>
                  </div>

                  <div className='flex items-start gap-3 rounded-lg border bg-card p-3'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30'>
                      <Mail className='h-5 w-5 text-green-600' />
                    </div>
                    <div>
                      <p className='font-medium text-sm'>Email Us</p>
                      <p className='text-sm text-muted-foreground'>
                        placement@naikcollege.org
                      </p>
                      <p className='text-xs text-muted-foreground mt-1'>
                        Response time: 24-48 hours
                      </p>
                    </div>
                  </div>

                  <div className='flex items-start gap-3 rounded-lg border bg-card p-3'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30'>
                      <Phone className='h-5 w-5 text-purple-600' />
                    </div>
                    <div>
                      <p className='font-medium text-sm'>Call Us</p>
                      <p className='text-sm text-muted-foreground'>
                        +91 02565 223045
                      </p>
                      <p className='text-xs text-muted-foreground mt-1'>
                        Mon - Sat, 9:00 AM - 5:00 PM
                      </p>
                    </div>
                  </div>

                  <div className='flex items-start gap-3 rounded-lg border bg-card p-3'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30'>
                      <Clock className='h-5 w-5 text-orange-600' />
                    </div>
                    <div>
                      <p className='font-medium text-sm'>Office Hours</p>
                      <p className='text-sm text-muted-foreground'>
                        Monday - Saturday<br />
                        9:00 AM - 5:00 PM
                      </p>
                      <p className='text-xs text-muted-foreground mt-1'>
                        Closed on Sundays and public holidays
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className='space-y-3'>
                <h3 className='font-semibold'>Before Contacting Us</h3>
                <div className='rounded-lg bg-muted/50 p-4'>
                  <ul className='text-sm text-muted-foreground space-y-2'>
                    <li className='flex items-start gap-2'>
                      <FileQuestion className='h-4 w-4 text-primary mt-0.5 shrink-0' />
                      <span>Check our <Link href="/faq" className="text-primary hover:underline">FAQ section</Link> for common questions</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <FileQuestion className='h-4 w-4 text-primary mt-0.5 shrink-0' />
                      <span>Review the <Link href="/terms-and-conditions" className="text-primary hover:underline">Terms & Conditions</Link> for usage guidelines</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <FileQuestion className='h-4 w-4 text-primary mt-0.5 shrink-0' />
                      <span>Ensure you are using a compatible browser (Chrome, Firefox, Edge, Safari)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='space-y-4'>
              <div className='flex items-center gap-3'>
                <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10'>
                  <MessageSquare className='h-6 w-6 text-primary' />
                </div>
                <div>
                  <CardTitle className='text-2xl'>Send a Message</CardTitle>
                  <CardDescription>We will respond within 24-48 hours</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='name'>Full Name</Label>
                  <div className='relative'>
                    <User className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                    <Input
                      id='name'
                      placeholder='Enter your full name'
                      className='pl-9'
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='email'>Email Address</Label>
                  <div className='relative'>
                    <Mail className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                    <Input
                      id='email'
                      type='email'
                      placeholder='Enter your email address'
                      className='pl-9'
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='subject'>Subject</Label>
                  <Input
                    id='subject'
                    placeholder='Brief description of your issue'
                    value={formData.subject}
                    onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='message'>Message</Label>
                  <Textarea
                    id='message'
                    placeholder='Describe your issue in detail...'
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                  />
                </div>

                <Button type='submit' className='w-full' disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Send className='mr-2 h-4 w-4' />
                      Send Message
                    </>
                  )}
                </Button>

                <p className='text-xs text-muted-foreground text-center'>
                  For urgent matters, please call us directly during office hours.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>

        <Card className='mt-8'>
          <CardHeader>
            <CardTitle className='text-lg'>Quick Help Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid gap-4 md:grid-cols-3'>
              <div className='rounded-lg border p-4 hover:bg-muted/50 transition-colors'>
                <p className='font-medium mb-1'>Student Issues</p>
                <p className='text-sm text-muted-foreground'>Profile updates, resume upload, application status</p>
              </div>
              <div className='rounded-lg border p-4 hover:bg-muted/50 transition-colors'>
                <p className='font-medium mb-1'>Company Support</p>
                <p className='text-sm text-muted-foreground'>Job postings, applicant management, technical issues</p>
              </div>
              <div className='rounded-lg border p-4 hover:bg-muted/50 transition-colors'>
                <p className='font-medium mb-1'>Account Access</p>
                <p className='text-sm text-muted-foreground'>Login issues, password reset, account recovery</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
