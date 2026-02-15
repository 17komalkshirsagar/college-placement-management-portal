'use client';

import Link from 'next/link';
import { ArrowLeft, HelpCircle, FileText, User, Building, Clock, Shield, Mail, Phone } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqCategories = [
  {
    title: 'Account & Registration',
    icon: User,
    items: [
      {
        question: 'How do I register on the placement portal?',
        answer: 'Student accounts are created by the TPO (Training and Placement Officer). You will receive login credentials via your institutional email. Company representatives need to register through the company registration form after verification by the placement cell.',
      },
      {
        question: 'I forgot my password. How can I reset it?',
        answer: 'Click on the "Forgot Password" link on the login page. Enter your registered email address, and you will receive a password reset link. If you do not receive the email within 5 minutes, check your spam folder or contact the placement office.',
      },
      {
        question: 'Can I change my registered email address?',
        answer: 'Email addresses are linked to your account for security reasons and cannot be changed. Please contact the placement cell if you need to update your email for legitimate reasons.',
      },
      {
        question: 'How do I update my profile information?',
        answer: 'Log in to your dashboard and navigate to the "My Profile" tab. You can update your mobile number, course, branch, year, and skills. Click "Save Changes" to update your profile.',
      },
    ],
  },
  {
    title: 'Resume & Documents',
    icon: FileText,
    items: [
      {
        question: 'What format should my resume be in?',
        answer: 'Only PDF format is accepted for resumes. Make sure your PDF is properly formatted and does not exceed 2MB in size. Include all relevant academic details, skills, and experience.',
      },
      {
        question: 'How do I upload my resume?',
        answer: 'Go to the "My Profile" tab in your dashboard. Under the Resume section, click "Choose PDF" to select your resume file, then click "Upload Resume". Your resume will be saved and attached to all future applications.',
      },
      {
        question: 'Can I update my resume after applying to a job?',
        answer: 'Once you apply to a job, the resume attached at the time of application is considered final. To use an updated resume, you will need to withdraw your application (if before deadline) and reapply with the new resume.',
      },
      {
        question: 'What if my resume upload fails?',
        answer: 'Ensure your file is in PDF format and under 2MB. Clear your browser cache and try again. If the issue persists, try using a different browser or contact support.',
      },
    ],
  },
  {
    title: 'Job Applications',
    icon: Building,
    items: [
      {
        question: 'How do I apply for a job?',
        answer: 'Browse available jobs in the "Available Jobs" tab. Click "Apply Now" on any job you are interested in. You will need to have a resume uploaded before you can apply. You can add an optional cover letter before submitting.',
      },
      {
        question: 'Can I apply to the same job more than once?',
        answer: 'No, duplicate applications are not allowed. The system automatically blocks multiple applications to the same job from the same student.',
      },
      {
        question: 'How do I know if my application was submitted successfully?',
        answer: 'After applying, you will see an "Applied" badge on the job card. You can also view all your applications in the "My Applications" tab with their current status.',
      },
      {
        question: 'Can I withdraw my application after submitting?',
        answer: 'Yes, you can withdraw your application before the job deadline. Go to "My Applications", find the job, and withdraw your application. You may then reapply with a different resume if desired.',
      },
      {
        question: 'What do the application statuses mean?',
        answer: 'Applied: Your application has been submitted. Shortlisted: The company has selected you for the next round. Rejected: Your application was not selected. Selected: You have been offered the position.',
      },
    ],
  },
  {
    title: 'Interview & Selection',
    icon: Clock,
    items: [
      {
        question: 'How will I know about interview schedules?',
        answer: 'Interview schedules will be communicated through your registered email and shown in your dashboard under "My Applications". Check regularly for updates.',
      },
      {
        question: 'What happens after I am shortlisted?',
        answer: 'Once shortlisted, the company may contact you directly for further rounds (technical interview, HR round, etc.). The placement cell will also be notified and can assist with any queries.',
      },
      {
        question: 'Can I decline an offer after accepting?',
        answer: 'While you can technically decline, doing so after accepting may affect your future placement eligibility. We strongly recommend only accepting offers you intend to honor.',
      },
    ],
  },
  {
    title: 'Privacy & Security',
    icon: Shield,
    items: [
      {
        question: 'Who can see my profile information?',
        answer: 'Your profile is visible to the placement cell administrators and companies that have posted jobs you have applied to. Your contact information is shared only when you apply to a job.',
      },
      {
        question: 'Is my resume shared with all companies?',
        answer: 'No, your resume is only accessible to companies whose jobs you have applied to. Companies cannot browse student profiles or download resumes without an application.',
      },
      {
        question: 'How is my data protected?',
        answer: 'We use industry-standard encryption and security measures to protect your data. Access is role-based, and all data handling complies with our Privacy Policy.',
      },
    ],
  },
];

export default function FaqPage(): React.ReactElement {
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

        <Card className='mb-8'>
          <CardHeader className='space-y-4'>
            <div className='flex items-center gap-3'>
              <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10'>
                <HelpCircle className='h-6 w-6 text-primary' />
              </div>
              <div>
                <CardTitle className='text-2xl md:text-3xl'>Frequently Asked Questions</CardTitle>
                <CardDescription className='mt-1'>Find answers to common questions about our placement portal</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className='rounded-lg bg-muted/50 p-4'>
              <p className='text-sm text-muted-foreground'>
                Can&apos;t find what you&apos;re looking for?{' '}
                <Link href='/help-support' className='text-primary hover:underline font-medium'>
                  Contact our support team
                </Link>{' '}
                or call us at +91 02565 223045.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className='space-y-8'>
          {faqCategories.map((category) => (
            <Card key={category.title}>
              <CardHeader>
                <CardTitle className='text-lg flex items-center gap-2'>
                  <category.icon className='h-5 w-5 text-primary' />
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent className='pt-0'>
                <Accordion type='single' collapsible className='w-full'>
                  {category.items.map((item, index) => (
                    <AccordionItem key={index} value={`${category.title}-${index}`}>
                      <AccordionTrigger className='text-sm font-medium'>
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className='text-sm text-muted-foreground leading-relaxed'>
                          {item.answer}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className='mt-8'>
          <CardContent className='p-6'>
            <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
              <div>
                <p className='font-medium'>Still have questions?</p>
                <p className='text-sm text-muted-foreground'>Our support team is here to help</p>
              </div>
              <div className='flex gap-3'>
                <Link href='/help-support'>
                  <span className='inline-flex items-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted'>
                    <Mail className='h-4 w-4' />
                    Email Support
                  </span>
                </Link>
                <a href='tel:+9102565223045'>
                  <span className='inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90'>
                    <Phone className='h-4 w-4' />
                    Call Now
                  </span>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
