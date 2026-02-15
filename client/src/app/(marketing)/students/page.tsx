import { FadeInSection } from '@/components/layout/fade-in-section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const cohorts = [
  { branch: 'Computer Science', year: 'Final Year', students: 420 },
  { branch: 'Information Technology', year: 'Final Year', students: 310 },
  { branch: 'Electronics', year: 'Final Year', students: 265 },
  { branch: 'Mechanical', year: 'Final Year', students: 290 },
];

export default function StudentsPage(): React.ReactElement {
  return (
    <div className='container space-y-6 py-12'>
      <FadeInSection>
        <div>
          <h1 className='text-3xl font-semibold'>Student Cohorts</h1>
          <p className='mt-2 text-muted-foreground'>Placement-eligible student cohorts managed by the placement office.</p>
        </div>
      </FadeInSection>
      <FadeInSection>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          {cohorts.map((cohort) => (
            <Card key={cohort.branch} className='transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md'>
              <CardHeader>
                <CardTitle className='text-lg'>{cohort.branch}</CardTitle>
              </CardHeader>
              <CardContent className='space-y-1 text-sm text-muted-foreground'>
                <p>{cohort.year}</p>
                <p>{cohort.students} students</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </FadeInSection>
    </div>
  );
}

