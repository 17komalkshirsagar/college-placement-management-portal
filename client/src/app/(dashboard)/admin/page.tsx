import { ArrowUpRight, BriefcaseBusiness, Building2, ClipboardList, GraduationCap, TrendingUp, UserCheck2, Users } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const stats = [
  { label: 'Total Students', value: '1,248', change: '+8.5%', icon: GraduationCap },
  { label: 'Total Companies', value: '142', change: '+4.3%', icon: Building2 },
  { label: 'Active Jobs', value: '86', change: '+12.1%', icon: BriefcaseBusiness },
  { label: 'Students Placed', value: '524', change: '+17.8%', icon: UserCheck2 },
  { label: 'Pending Applications', value: '1,932', change: '-2.6%', icon: ClipboardList },
];

const monthlyPlacements = [44, 52, 60, 74, 68, 82, 90, 106, 97, 112, 120, 138];
const jobsVsApplications = [
  { month: 'Jan', jobs: 12, applications: 84 },
  { month: 'Feb', jobs: 15, applications: 96 },
  { month: 'Mar', jobs: 18, applications: 114 },
  { month: 'Apr', jobs: 17, applications: 108 },
  { month: 'May', jobs: 20, applications: 127 },
  { month: 'Jun', jobs: 23, applications: 148 },
];

const recentStudents = ['Komal Patil (CSE)', 'Rahul Chavan (ECE)', 'Sonal Jadhav (MBA)', 'Amaan Shaikh (ME)'];
const recentJobs = ['Backend Engineer - Acme', 'Data Analyst - Nova', 'QA Engineer - PixelWorks', 'DevOps Trainee - Vertex'];
const latestSelections = ['Priya Kulkarni selected at Infosys', 'Rohan Borse selected at TCS', 'Aditi Deshmukh selected at Capgemini'];

const placementHeightClass: Record<number, string> = {
  44: 'h-[31%]',
  52: 'h-[37%]',
  60: 'h-[43%]',
  74: 'h-[53%]',
  68: 'h-[49%]',
  82: 'h-[59%]',
  90: 'h-[64%]',
  106: 'h-[76%]',
  97: 'h-[69%]',
  112: 'h-[80%]',
  120: 'h-[86%]',
  138: 'h-[98%]',
};

export default function AdminDashboardPage(): React.ReactElement {
  return (
    <section className='space-y-6'>
      <div>
        <h1 className='text-2xl font-semibold tracking-tight'>Admin Dashboard</h1>
        <p className='text-sm text-muted-foreground'>Placement operations snapshot and campus hiring trends.</p>
      </div>

      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-5'>
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label} className='transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md'>
              <CardHeader className='pb-2'>
                <CardDescription>{item.label}</CardDescription>
                <CardTitle className='text-2xl'>{item.value}</CardTitle>
              </CardHeader>
              <CardContent className='flex items-center justify-between'>
                <Badge variant='secondary' className='gap-1'>
                  <TrendingUp className='h-3 w-3' /> {item.change}
                </Badge>
                <Icon className='h-5 w-5 text-muted-foreground' />
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className='grid gap-4 xl:grid-cols-3'>
        <Card className='xl:col-span-2'>
          <CardHeader>
            <CardTitle className='text-lg'>Monthly Placements</CardTitle>
            <CardDescription>Student selections trend over the year.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex h-56 items-end gap-2'>
              {monthlyPlacements.map((value, index) => (
                <div key={`${value}-${index}`} className='group flex-1'>
                  <div className={`w-full rounded-md bg-primary/25 transition-all duration-300 group-hover:bg-primary ${placementHeightClass[value]}`} />
                </div>
              ))}
            </div>
            <div className='mt-3 flex items-center justify-between text-xs text-muted-foreground'>
              <span>Jan</span>
              <span>Jun</span>
              <span>Dec</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Jobs vs Applications</CardTitle>
            <CardDescription>Hiring demand vs student responses.</CardDescription>
          </CardHeader>
          <CardContent className='space-y-3'>
            {jobsVsApplications.map((item) => (
              <div key={item.month} className='space-y-1'>
                <div className='flex items-center justify-between text-xs'>
                  <span className='font-medium'>{item.month}</span>
                  <span className='text-muted-foreground'>J:{item.jobs} A:{item.applications}</span>
                </div>
                <div className='grid grid-cols-10 gap-1'>
                  <div className='col-span-3 h-2 rounded bg-primary/60' />
                  <div className='col-span-7 h-2 rounded bg-primary/25' />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-4 xl:grid-cols-3'>
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Recently Added Students</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            {recentStudents.map((item) => (
              <div key={item} className='flex items-center justify-between rounded-md border p-3 text-sm transition-colors hover:bg-muted/50'>
                <span>{item}</span>
                <Users className='h-4 w-4 text-muted-foreground' />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Recently Posted Jobs</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            {recentJobs.map((item) => (
              <div key={item} className='flex items-center justify-between rounded-md border p-3 text-sm transition-colors hover:bg-muted/50'>
                <span>{item}</span>
                <ArrowUpRight className='h-4 w-4 text-muted-foreground' />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Latest Selections</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            {latestSelections.map((item) => (
              <div key={item} className='rounded-md border p-3 text-sm transition-colors hover:bg-muted/50'>
                {item}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
