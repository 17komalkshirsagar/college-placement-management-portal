import { CheckCircle2 } from 'lucide-react';

import { FadeInSection } from '@/components/layout/fade-in-section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const benefits = {
  students: ['Single dashboard for applications', 'Transparent status tracking', 'Structured hiring timelines'],
  companies: ['Quality student pipeline', 'Fast shortlist/reject/select workflow', 'Centralized applicant records'],
  college: ['Placement visibility', 'Reliable performance metrics', 'Consistent governance across drives'],
};

export default function AboutPage(): React.ReactElement {
  return (
    <div className='container space-y-10 py-12'>
      <FadeInSection>
        <div className='max-w-3xl space-y-4'>
          <h1 className='text-3xl font-semibold tracking-tight'>About The Placement Portal</h1>
          <p className='text-muted-foreground'>
            This platform is designed to run the complete college placement lifecycle with trust, transparency, and operational discipline.
          </p>
        </div>
      </FadeInSection>

      <FadeInSection>
        <Card>
          <CardHeader>
            <CardTitle>Placement Process</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3 text-sm text-muted-foreground'>
            <p>1. Admin/TPO creates and manages student and company accounts.</p>
            <p>2. Companies publish job opportunities and review applicants.</p>
            <p>3. Students apply with resumes and monitor decision updates.</p>
            <p>4. Final selections are tracked with measurable outcomes and audit-ready records.</p>
          </CardContent>
        </Card>
      </FadeInSection>

      <FadeInSection>
        <div className='grid gap-4 md:grid-cols-3'>
          <Card>
            <CardHeader>
              <CardTitle>For Students</CardTitle>
            </CardHeader>
            <CardContent className='space-y-2'>
              {benefits.students.map((item) => (
                <p key={item} className='flex items-start gap-2 text-sm text-muted-foreground'>
                  <CheckCircle2 className='mt-0.5 h-4 w-4 text-primary' />
                  {item}
                </p>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>For Companies</CardTitle>
            </CardHeader>
            <CardContent className='space-y-2'>
              {benefits.companies.map((item) => (
                <p key={item} className='flex items-start gap-2 text-sm text-muted-foreground'>
                  <CheckCircle2 className='mt-0.5 h-4 w-4 text-primary' />
                  {item}
                </p>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>For College</CardTitle>
            </CardHeader>
            <CardContent className='space-y-2'>
              {benefits.college.map((item) => (
                <p key={item} className='flex items-start gap-2 text-sm text-muted-foreground'>
                  <CheckCircle2 className='mt-0.5 h-4 w-4 text-primary' />
                  {item}
                </p>
              ))}
            </CardContent>
          </Card>
        </div>
      </FadeInSection>

      <FadeInSection>
        <Card>
          <CardHeader>
            <CardTitle>Trust and Transparency</CardTitle>
          </CardHeader>
          <CardContent className='text-sm text-muted-foreground'>
            Every application state is recorded with decision history to ensure fairness, accountability, and visibility across all stakeholders.
          </CardContent>
        </Card>
      </FadeInSection>
    </div>
  );
}

