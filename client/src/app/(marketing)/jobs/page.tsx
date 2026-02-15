import { BriefcaseBusiness, MapPin, Star } from 'lucide-react';

import { FadeInSection } from '@/components/layout/fade-in-section';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const jobs = [
  { company: 'Accenture', role: 'Associate Software Engineer', packageLpa: '6.5 LPA', location: 'Pune', eligibility: 'B.Tech CSE/IT' },
  { company: 'Infosys', role: 'Systems Engineer', packageLpa: '5.8 LPA', location: 'Bengaluru', eligibility: 'B.E / B.Tech' },
  { company: 'Deloitte', role: 'Analyst', packageLpa: '7.2 LPA', location: 'Hyderabad', eligibility: 'Any Branch with SQL Basics' },
  { company: 'Capgemini', role: 'Junior Consultant', packageLpa: '6.1 LPA', location: 'Mumbai', eligibility: 'B.E / B.Tech / MCA' },
  { company: 'Cognizant', role: 'Programmer Analyst', packageLpa: '5.6 LPA', location: 'Chennai', eligibility: 'B.Tech all branches' },
  { company: 'TCS', role: 'Graduate Trainee', packageLpa: '4.9 LPA', location: 'Noida', eligibility: 'B.Sc / BCA / B.Tech' },
];

const reviews = [
  {
    name: 'Pooja K.',
    role: 'Placed at Deloitte',
    text: 'The portal made the process very clear. I could track every update and prepare better for each stage.',
  },
  {
    name: 'Rohit S.',
    role: 'Placed at Infosys',
    text: 'Easy to apply and transparent status updates. I always knew where I stood in the process.',
  },
  {
    name: 'Aarti P.',
    role: 'Placed at Accenture',
    text: 'The placement team and portal workflow helped me manage interviews and final selection smoothly.',
  },
];

export default function JobsPage(): React.ReactElement {
  return (
    <div className='container space-y-10 py-12'>
      <FadeInSection>
        <div>
          <h1 className='text-3xl font-semibold'>Open Jobs</h1>
          <p className='mt-2 text-muted-foreground'>Explore active campus opportunities from participating companies.</p>
        </div>
      </FadeInSection>

      <FadeInSection>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {jobs.map((job) => (
            <Card key={`${job.company}-${job.role}`} className='transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md'>
              <CardHeader>
                <CardTitle className='text-xl'>{job.role}</CardTitle>
                <CardDescription>{job.company}</CardDescription>
              </CardHeader>
              <CardContent className='space-y-2 text-sm text-muted-foreground'>
                <p className='flex items-center gap-2'>
                  <BriefcaseBusiness className='h-4 w-4' /> Package: {job.packageLpa}
                </p>
                <p className='flex items-center gap-2'>
                  <MapPin className='h-4 w-4' /> Location: {job.location}
                </p>
                <p>Eligibility: {job.eligibility}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </FadeInSection>

      <FadeInSection>
        <Card>
          <CardHeader>
            <CardTitle>College Location</CardTitle>
            <CardDescription>Visit the placement office for in-person assistance.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='overflow-hidden rounded-lg border'>
              <iframe
                title='Vasantrao Naik Mahavidyalaya Location'
                src='https://www.google.com/maps?q=Vasantrao+Naik+Mahavidyalaya+Aurangabad&output=embed'
                className='h-[320px] w-full'
                loading='lazy'
                referrerPolicy='no-referrer-when-downgrade'
              />
            </div>
          </CardContent>
        </Card>
      </FadeInSection>

      <FadeInSection>
        <div className='space-y-4'>
          <h2 className='text-2xl font-semibold'>Student Reviews</h2>
          <div className='grid gap-4 md:grid-cols-3'>
            {reviews.map((review) => (
              <Card key={review.name} className='transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md'>
                <CardHeader>
                  <div className='flex items-center gap-1 text-amber-500'>
                    <Star className='h-4 w-4 fill-current' />
                    <Star className='h-4 w-4 fill-current' />
                    <Star className='h-4 w-4 fill-current' />
                    <Star className='h-4 w-4 fill-current' />
                    <Star className='h-4 w-4 fill-current' />
                  </div>
                  <CardTitle className='text-base'>{review.name}</CardTitle>
                  <CardDescription>{review.role}</CardDescription>
                </CardHeader>
                <CardContent className='text-sm text-muted-foreground'>{review.text}</CardContent>
              </Card>
            ))}
          </div>
        </div>
      </FadeInSection>
    </div>
  );
}
