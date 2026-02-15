'use client';

import Link from 'next/link';
import { ArrowLeft, Shield, Mail, Phone, MapPin, Lock, Eye, UserCheck, FileText } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function PrivacyPolicyPage(): React.ReactElement {
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

        <Card>
          <CardHeader className='space-y-4'>
            <div className='flex items-center gap-3'>
              <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10'>
                <Shield className='h-6 w-6 text-primary' />
              </div>
              <div>
                <CardTitle className='text-2xl md:text-3xl'>Privacy Policy</CardTitle>
                <CardDescription className='mt-1'>Last updated: February 2026</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className='space-y-8'>
            <section className='space-y-3'>
              <h2 className='text-lg font-semibold flex items-center gap-2'>
                <FileText className='h-5 w-5 text-primary' />
                Introduction
              </h2>
              <p className='text-sm text-muted-foreground leading-relaxed'>
                Vasantrao Naik Mahavidyalaya Placement Management Portal (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, disclosed, and safeguarded when you use our college placement management system. By accessing or using our platform, you agree to the terms of this Privacy Policy.
              </p>
            </section>

            <Separator />

            <section className='space-y-3'>
              <h2 className='text-lg font-semibold flex items-center gap-2'>
                <UserCheck className='h-5 w-5 text-primary' />
                Information We Collect
              </h2>
              <div className='grid gap-4 md:grid-cols-2'>
                <div className='rounded-lg border bg-card p-4'>
                  <h3 className='font-medium mb-2'>Student Information</h3>
                  <ul className='text-sm text-muted-foreground space-y-1'>
                    <li>• Full name and email address</li>
                    <li>• Phone number</li>
                    <li>• Academic details (course, branch, year)</li>
                    <li>• Resume and supporting documents</li>
                    <li>• Placement application history</li>
                  </ul>
                </div>
                <div className='rounded-lg border bg-card p-4'>
                  <h3 className='font-medium mb-2'>Company Information</h3>
                  <ul className='text-sm text-muted-foreground space-y-1'>
                    <li>• Company name and details</li>
                    <li>• Contact person information</li>
                    <li>• Job posting details</li>
                    <li>• Recruitment requirements</li>
                    <li>• Selection decisions</li>
                  </ul>
                </div>
              </div>
            </section>

            <Separator />

            <section className='space-y-3'>
              <h2 className='text-lg font-semibold flex items-center gap-2'>
                <Eye className='h-5 w-5 text-primary' />
                How We Use Your Data
              </h2>
              <div className='space-y-3 text-sm text-muted-foreground'>
                <p>Your information is used for the following purposes:</p>
                <ul className='grid gap-2 md:grid-cols-2'>
                  <li className='flex items-start gap-2'>
                    <span className='mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0' />
                    <span>Facilitating placement recruitment processes</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <span className='mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0' />
                    <span>Matching students with suitable job opportunities</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <span className='mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0' />
                    <span>Communicating job updates and notifications</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <span className='mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0' />
                    <span>Maintaining placement records and analytics</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <span className='mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0' />
                    <span>Verifying student eligibility and credentials</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <span className='mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0' />
                    <span>Generating reports for institutional purposes</span>
                  </li>
                </ul>
              </div>
            </section>

            <Separator />

            <section className='space-y-3'>
              <h2 className='text-lg font-semibold flex items-center gap-2'>
                <Lock className='h-5 w-5 text-primary' />
                Data Security
              </h2>
              <div className='space-y-3 text-sm text-muted-foreground'>
                <p>We implement appropriate technical and organizational measures to protect your personal data:</p>
                <ul className='space-y-2'>
                  <li className='flex items-start gap-2'>
                    <span className='mt-1.5 h-1.5 w-1.5 rounded-full bg-green-500 shrink-0' />
                    <span>Industry-standard encryption for data in transit and at rest</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <span className='mt-1.5 h-1.5 w-1.5 rounded-full bg-green-500 shrink-0' />
                    <span>Role-based access control to ensure data visibility only to authorized personnel</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <span className='mt-1.5 h-1.5 w-1.5 rounded-full bg-green-500 shrink-0' />
                    <span>Regular security assessments and vulnerability scans</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <span className='mt-1.5 h-1.5 w-1.5 rounded-full bg-green-500 shrink-0' />
                    <span>Secure authentication mechanisms including multi-factor authentication</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <span className='mt-1.5 h-1.5 w-1.5 rounded-full bg-green-500 shrink-0' />
                    <span>Audit logging for all data access and modifications</span>
                  </li>
                </ul>
              </div>
            </section>

            <Separator />

            <section className='space-y-3'>
              <h2 className='text-lg font-semibold flex items-center gap-2'>
                <UserCheck className='h-5 w-5 text-primary' />
                Data Sharing & Third Parties
              </h2>
              <p className='text-sm text-muted-foreground leading-relaxed'>
                We do not sell, trade, or otherwise transfer your personal information to outside parties except where necessary for placement activities. Your data may be shared with recruiting companies participating in campus placement drives, with your explicit application to their job postings. We may also share data with regulatory authorities when required by law.
              </p>
            </section>

            <Separator />

            <section className='space-y-3'>
              <h2 className='text-lg font-semibold flex items-center gap-2'>
                <UserCheck className='h-5 w-5 text-primary' />
                Your Rights
              </h2>
              <div className='grid gap-3 md:grid-cols-2'>
                <div className='rounded-lg border bg-card p-4'>
                  <h3 className='font-medium mb-2'>Students</h3>
                  <ul className='text-sm text-muted-foreground space-y-1'>
                    <li>• Access your profile and application data</li>
                    <li>• Update academic and contact information</li>
                    <li>• Withdraw applications to jobs</li>
                    <li>• Request data export</li>
                  </ul>
                </div>
                <div className='rounded-lg border bg-card p-4'>
                  <h3 className='font-medium mb-2'>Companies</h3>
                  <ul className='text-sm text-muted-foreground space-y-1'>
                    <li>• Manage job postings</li>
                    <li>• Access applicant profiles</li>
                    <li>• Update recruitment status</li>
                    <li>• Export recruitment reports</li>
                  </ul>
                </div>
              </div>
            </section>

            <Separator />

            <section className='space-y-3'>
              <h2 className='text-lg font-semibold flex items-center gap-2'>
                <Mail className='h-5 w-5 text-primary' />
                Contact Information
              </h2>
              <div className='rounded-lg border bg-muted/50 p-4'>
                <p className='text-sm text-muted-foreground mb-4'>
                  If you have questions or concerns about this Privacy Policy or our data practices, please contact the Placement Cell:
                </p>
                <div className='space-y-2 text-sm'>
                  <div className='flex items-center gap-2'>
                    <MapPin className='h-4 w-4 text-muted-foreground' />
                    <span>Vasantrao Naik Mahavidyalaya, Airport Road, Cidco, Aurangabad, Maharashtra - 431001</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Mail className='h-4 w-4 text-muted-foreground' />
                    <span>placement@naikcollege.org</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Phone className='h-4 w-4 text-muted-foreground' />
                    <span>+91 02565 223045</span>
                  </div>
                </div>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
