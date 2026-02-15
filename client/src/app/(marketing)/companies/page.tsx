import { FadeInSection } from '@/components/layout/fade-in-section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const companies = [
  { name: 'Accenture', sector: 'Consulting & Technology', offices: 'Pune, Mumbai, Bengaluru' },
  { name: 'TCS', sector: 'IT Services', offices: 'Mumbai, Chennai, Hyderabad' },
  { name: 'Cognizant', sector: 'Digital Engineering', offices: 'Pune, Chennai, Kolkata' },
  { name: 'Capgemini', sector: 'Technology Services', offices: 'Mumbai, Noida, Bengaluru' },
];

export default function CompaniesPage(): React.ReactElement {
  return (
    <div className='container space-y-6 py-12'>
      <FadeInSection>
        <div>
          <h1 className='text-3xl font-semibold'>Hiring Companies</h1>
          <p className='mt-2 text-muted-foreground'>Partner organizations actively participating in recruitment drives.</p>
        </div>
      </FadeInSection>
      <FadeInSection>
        <div className='grid gap-4 md:grid-cols-2'>
          {companies.map((company) => (
            <Card key={company.name} className='transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md'>
              <CardHeader>
                <CardTitle>{company.name}</CardTitle>
              </CardHeader>
              <CardContent className='space-y-1 text-sm text-muted-foreground'>
                <p>Sector: {company.sector}</p>
                <p>Offices: {company.offices}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </FadeInSection>
    </div>
  );
}

