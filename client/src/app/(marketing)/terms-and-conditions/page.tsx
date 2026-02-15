'use client';

import Link from 'next/link';
import { ArrowLeft, FileText, AlertTriangle, CheckCircle, XCircle, Ban, Users, Building, GraduationCap } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function TermsPage(): React.ReactElement {
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
                <FileText className='h-6 w-6 text-primary' />
              </div>
              <div>
                <CardTitle className='text-2xl md:text-3xl'>Terms & Conditions</CardTitle>
                <CardDescription className='mt-1'>Last updated: February 2026</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className='space-y-8'>
            <section className='space-y-3'>
              <p className='text-sm text-muted-foreground leading-relaxed'>
                Welcome to the Vasantrao Naik Mahavidyalaya Placement Management Portal. By accessing and using this platform, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use this portal.
              </p>
            </section>

            <Separator />

            <section className='space-y-4'>
              <h2 className='text-lg font-semibold flex items-center gap-2'>
                <Users className='h-5 w-5 text-primary' />
                User Responsibilities
              </h2>
              <div className='grid gap-4 md:grid-cols-2'>
                <div className='rounded-lg border bg-card p-4'>
                  <h3 className='font-medium mb-3 flex items-center gap-2'>
                    <GraduationCap className='h-4 w-4 text-blue-500' />
                    Student Responsibilities
                  </h3>
                  <ul className='text-sm text-muted-foreground space-y-2'>
                    <li className='flex items-start gap-2'>
                      <CheckCircle className='h-4 w-4 text-green-500 mt-0.5 shrink-0' />
                      <span>Provide accurate and up-to-date academic information</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <CheckCircle className='h-4 w-4 text-green-500 mt-0.5 shrink-0' />
                      <span>Upload genuine and properly formatted resume (PDF only)</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <CheckCircle className='h-4 w-4 text-green-500 mt-0.5 shrink-0' />
                      <span>Apply only to positions matching eligibility criteria</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <CheckCircle className='h-4 w-4 text-green-500 mt-0.5 shrink-0' />
                      <span>Attend scheduled interviews and selection processes</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <CheckCircle className='h-4 w-4 text-green-500 mt-0.5 shrink-0' />
                      <span>Maintain professional conduct throughout recruitment</span>
                    </li>
                  </ul>
                </div>
                <div className='rounded-lg border bg-card p-4'>
                  <h3 className='font-medium mb-3 flex items-center gap-2'>
                    <Building className='h-4 w-4 text-green-500' />
                    Company Responsibilities
                  </h3>
                  <ul className='text-sm text-muted-foreground space-y-2'>
                    <li className='flex items-start gap-2'>
                      <CheckCircle className='h-4 w-4 text-green-500 mt-0.5 shrink-0' />
                      <span>Post genuine job openings with accurate details</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <CheckCircle className='h-4 w-4 text-green-500 mt-0.5 shrink-0' />
                      <span>Provide clear eligibility criteria for positions</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <CheckCircle className='h-4 w-4 text-green-500 mt-0.5 shrink-0' />
                      <span>Communicate selection decisions within stipulated time</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <CheckCircle className='h-4 w-4 text-green-500 mt-0.5 shrink-0' />
                      <span>Honor offers made to selected candidates</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <CheckCircle className='h-4 w-4 text-green-500 mt-0.5 shrink-0' />
                      <span>Maintain confidentiality of student information</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <Separator />

            <section className='space-y-4'>
              <h2 className='text-lg font-semibold flex items-center gap-2'>
                <FileText className='h-5 w-5 text-primary' />
                Account Usage Rules
              </h2>
              <div className='space-y-3 text-sm text-muted-foreground'>
                <p>All users must adhere to the following account usage guidelines:</p>
                <ol className='list-decimal list-inside space-y-2'>
                  <li>Each student, company, and administrator is entitled to a single account. Multiple accounts are strictly prohibited.</li>
                  <li>Account credentials are personal and non-transferable. Users are responsible for maintaining the security of their login information.</li>
                  <li>Accounts must be registered using official institutional email addresses where applicable.</li>
                  <li>Users must immediately report any unauthorized access or security breaches to the placement office.</li>
                  <li>Inactive accounts may be suspended after a prolonged period of inactivity at the discretion of administrators.</li>
                </ol>
              </div>
            </section>

            <Separator />

            <section className='space-y-4'>
              <h2 className='text-lg font-semibold flex items-center gap-2'>
                <FileText className='h-5 w-5 text-primary' />
                Job Application Rules
              </h2>
              <div className='rounded-lg border bg-card p-4'>
                <ul className='text-sm text-muted-foreground space-y-3'>
                  <li className='flex items-start gap-3'>
                    <span className='flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600 text-xs font-medium shrink-0'>1</span>
                    <span>Students may apply to multiple jobs as long as they meet the eligibility criteria for each position.</span>
                  </li>
                  <li className='flex items-start gap-3'>
                    <span className='flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600 text-xs font-medium shrink-0'>2</span>
                    <span>Each student can submit only one application per job posting. Duplicate applications will be automatically rejected.</span>
                  </li>
                  <li className='flex items-start gap-3'>
                    <span className='flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600 text-xs font-medium shrink-0'>3</span>
                    <span>Once an application is submitted, it cannot be modified. Students must withdraw and reapply if needed (before deadline).</span>
                  </li>
                  <li className='flex items-start gap-3'>
                    <span className='flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600 text-xs font-medium shrink-0'>4</span>
                    <span>Companies must process all applications and provide status updates within 30 days of the application deadline.</span>
                  </li>
                  <li className='flex items-start gap-3'>
                    <span className='flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600 text-xs font-medium shrink-0'>5</span>
                    <span>Students who accept an offer must honor the commitment. Withdrawal after acceptance may affect future placement eligibility.</span>
                  </li>
                </ul>
              </div>
            </section>

            <Separator />

            <section className='space-y-4'>
              <h2 className='text-lg font-semibold flex items-center gap-2'>
                <AlertTriangle className='h-5 w-5 text-primary' />
                Platform Limitations
              </h2>
              <div className='rounded-lg border border-amber-200 bg-amber-50/50 p-4'>
                <ul className='text-sm text-muted-foreground space-y-2'>
                  <li className='flex items-start gap-2'>
                    <XCircle className='h-4 w-4 text-amber-600 mt-0.5 shrink-0' />
                    <span>The platform does not guarantee job placement or interview calls.</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <XCircle className='h-4 w-4 text-amber-600 mt-0.5 shrink-0' />
                    <span>We are not responsible for any financial disputes between students and recruiting companies.</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <XCircle className='h-4 w-4 text-amber-600 mt-0.5 shrink-0' />
                    <span>Job postings are subject to verification but the platform does not guarantee their authenticity.</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <XCircle className='h-4 w-4 text-amber-600 mt-0.5 shrink-0' />
                    <span>Technical issues may occasionally affect platform availability; we strive to minimize downtime.</span>
                  </li>
                </ul>
              </div>
            </section>

            <Separator />

            <section className='space-y-4'>
              <h2 className='text-lg font-semibold flex items-center gap-2'>
                <Ban className='h-5 w-5 text-primary' />
                Prohibited Activities
              </h2>
              <div className='rounded-lg border border-red-200 bg-red-50/50 p-4'>
                <ul className='text-sm text-muted-foreground space-y-2'>
                  <li className='flex items-start gap-2'>
                    <XCircle className='h-4 w-4 text-red-600 mt-0.5 shrink-0' />
                    <span>Creating multiple accounts to bypass application limits</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <XCircle className='h-4 w-4 text-red-600 mt-0.5 shrink-0' />
                    <span>Submitting false or misleading information in profiles and applications</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <XCircle className='h-4 w-4 text-red-600 mt-0.5 shrink-0' />
                    <span>Sharing login credentials with others</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <XCircle className='h-4 w-4 text-red-600 mt-0.5 shrink-0' />
                    <span>Attempting to access unauthorized data or system resources</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <XCircle className='h-4 w-4 text-red-600 mt-0.5 shrink-0' />
                    <span>Posting fraudulent job listings or misleading recruitment content</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <XCircle className='h-4 w-4 text-red-600 mt-0.5 shrink-0' />
                    <span>Harassment, discrimination, or unfair treatment of any user</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <XCircle className='h-4 w-4 text-red-600 mt-0.5 shrink-0' />
                    <span>Commercial solicitation or advertising on the platform</span>
                  </li>
                </ul>
              </div>
            </section>

            <Separator />

            <section className='space-y-4'>
              <h2 className='text-lg font-semibold flex items-center gap-2'>
                <Ban className='h-5 w-5 text-primary' />
                Termination Policy
              </h2>
              <div className='space-y-3 text-sm text-muted-foreground'>
                <p>The placement cell reserves the right to terminate or suspend accounts in the following circumstances:</p>
                <ul className='space-y-2'>
                  <li className='flex items-start gap-2'>
                    <span className='mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0' />
                    <span>Violation of any terms and conditions outlined in this document</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <span className='mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0' />
                    <span>Providing false or fraudulent information during registration or application</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <span className='mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0' />
                    <span>Engaging in malpractice or unethical behavior during placement activities</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <span className='mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0' />
                    <span>Misuse of the platform for unauthorized purposes</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <span className='mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0' />
                    <span>At the request of the user (with proper verification)</span>
                  </li>
                </ul>
                <p className='pt-2'>
                  Terminated accounts may lose access to all placement services, and such actions may be recorded in the student&apos;s academic档案.
                </p>
              </div>
            </section>

            <Separator />

            <section className='space-y-3'>
              <p className='text-sm text-muted-foreground leading-relaxed'>
                By using the Vasantrao Naik Mahavidyalaya Placement Management Portal, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. These terms are subject to change without notice. Continued use of the platform after modifications constitutes acceptance of the updated terms.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
