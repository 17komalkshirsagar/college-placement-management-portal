import Link from 'next/link';
import { ArrowRight, BarChart3, BriefcaseBusiness, Building2, MapPin, Users } from 'lucide-react';

import { FadeInSection } from '@/components/layout/fade-in-section';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const stats = [
  { label: 'Total Students', value: '2,450', icon: Users },
  { label: 'Companies', value: '180+', icon: Building2 },
  { label: 'Jobs Posted', value: '620', icon: BriefcaseBusiness },
  { label: 'Students Placed', value: '1,920', icon: BarChart3 },
];

const openJobs = [
  {
    role: 'Software Engineer',
    company: 'Accenture',
    packageLpa: '6.5 LPA',
    location: 'Pune',
    eligibility: 'B.Tech CSE/IT 2026 passout',
  },
  {
    role: 'Systems Engineer',
    company: 'Infosys',
    packageLpa: '5.8 LPA',
    location: 'Bengaluru',
    eligibility: 'B.E / B.Tech all branches',
  },
  {
    role: 'Data Analyst',
    company: 'Deloitte',
    packageLpa: '7.2 LPA',
    location: 'Hyderabad',
    eligibility: 'Any branch with SQL basics',
  },
];

const placementCycle = [
  {
    title: 'Account Setup',
    description: 'Admin/TPO creates verified student and company accounts with secure credentials.',
  },
  {
    title: 'Job Publishing',
    description: 'Companies post openings with role details, package, location, and eligibility criteria.',
  },
  {
    title: 'Application Review',
    description: 'Students apply and companies evaluate applications with shortlist/reject/select actions.',
  },
  {
    title: 'Final Selection',
    description: 'Selection outcomes are tracked and reflected in placement analytics and history.',
  },
];

export default function HomePage(): React.ReactElement {
  return (
    <div className='space-y-20 pb-20'>
      <section className='container pl-4 md:pl-6 lg:pl-8 pr-4 md:pr-6 lg:pr-8 pt-12 md:pt-16'>
        <FadeInSection>
          <div className='grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]'>
            <div>
              <div className='inline-flex rounded-full border bg-muted px-3 py-1 text-xs text-muted-foreground'>Daily Placement Operations Platform</div>
              <h1 className='mt-5 text-balance text-4xl font-semibold tracking-tight md:text-5xl'>
                Real-Time Placement Portal for Campus Hiring Workflows
              </h1>
              <p className='mt-5 max-w-xl text-lg text-muted-foreground'>
                End-to-end platform for Admin/TPO teams, Students, and Companies to manage openings, applications, and selections efficiently.
              </p>
              <div className='mt-8 flex flex-wrap gap-3'>
                <Button asChild size='lg' className='gap-2'>
                  <Link href='/jobs'>
                    View Jobs <ArrowRight className='h-4 w-4' />
                  </Link>
                </Button>
                <Button asChild size='lg' variant='outline'>
                  <Link href='/login'>Login</Link>
                </Button>
              </div>
            </div>
            <div className='relative overflow-hidden rounded-2xl border bg-card shadow-sm'>
              <img
                src='https://plus.unsplash.com/premium_photo-1682093297369-9ed9fe352b6a?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                alt='College placement environment'
                className='h-[320px] w-full object-cover transition-transform duration-700 hover:scale-105'
              />
            </div>
          </div>
        </FadeInSection>
      </section>

      <section className='container pl-4 md:pl-6 lg:pl-8 pr-4 md:pr-6 lg:pr-8'>
        <FadeInSection>
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} className='transition-all duration-300 hover:-translate-y-1 hover:shadow-md'>
                  <CardHeader className='flex flex-row items-center justify-between pb-2'>
                    <CardTitle className='text-sm font-medium text-muted-foreground'>{stat.label}</CardTitle>
                    <Icon className='h-4 w-4 text-muted-foreground' />
                  </CardHeader>
                  <CardContent>
                    <p className='text-2xl font-semibold'>{stat.value}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </FadeInSection>
      </section>

      <section className='container pl-4 md:pl-6 lg:pl-8 pr-4 md:pr-6 lg:pr-8'>
        <FadeInSection>
          <div className='rounded-xl border bg-card p-6 shadow-sm'>
            <div className='flex items-center justify-between gap-4'>
              <div>
                <h2 className='text-2xl font-semibold'>Open Jobs</h2>
                <p className='mt-2 text-sm text-muted-foreground'>Latest opportunities currently accepting applications.</p>
              </div>
              <Button asChild variant='outline'>
                <Link href='/jobs'>See All</Link>
              </Button>
            </div>
            <div className='mt-6 grid gap-4 md:grid-cols-3'>
              {openJobs.map((job) => (
                <Card key={`${job.company}-${job.role}`} className='transition-all duration-300 hover:-translate-y-1 hover:shadow-md'>
                  <CardHeader>
                    <CardTitle className='text-lg'>{job.role}</CardTitle>
                    <CardDescription>{job.company}</CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-2 text-sm text-muted-foreground'>
                    <p>Package: {job.packageLpa}</p>
                    <p className='flex items-center gap-1'>
                      <MapPin className='h-4 w-4' /> {job.location}
                    </p>
                    <p>Eligibility: {job.eligibility}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </FadeInSection>
      </section>

      <section className='container pl-4 md:pl-6 lg:pl-8 pr-4 md:pr-6 lg:pr-8'>
        <FadeInSection>
          <div className='rounded-xl border bg-card p-6 shadow-sm'>
            <h2 className='text-2xl font-semibold'>Placement Cycle</h2>
            <p className='mt-2 text-sm text-muted-foreground'>How placement operations move from onboarding to final selection.</p>
            <div className='mt-6 grid gap-4 md:grid-cols-2'>
              {placementCycle.map((step, index) => (
                <Card key={step.title} className='transition-all duration-300 hover:-translate-y-1 hover:shadow-md'>
                  <CardHeader className='pb-2'>
                    <CardTitle className='text-lg'>
                      Step {index + 1}: {step.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='text-sm text-muted-foreground'>{step.description}</CardContent>
                </Card>
              ))}
            </div>
          </div>
        </FadeInSection>
      </section>

      <section className='container pl-4 md:pl-6 lg:pl-8 pr-4 md:pr-6 lg:pr-8'>
        <FadeInSection>
          <div className='rounded-xl border bg-primary/5 p-8 text-center'>
            <h3 className='text-2xl font-semibold'>Ready to manage hiring operations with clarity?</h3>
            <p className='mx-auto mt-3 max-w-2xl text-muted-foreground'>
              Secure access, role-based workflows, and structured data for day-to-day placement operations.
            </p>
            <Button asChild className='mt-6' size='lg'>
              <Link href='/login'>Login to Portal</Link>
            </Button>
          </div>
        </FadeInSection>
      </section>
    </div>
  );
}
