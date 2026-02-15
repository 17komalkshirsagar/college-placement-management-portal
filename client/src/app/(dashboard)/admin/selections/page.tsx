import { BadgeCheck, CircleX, Trophy } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const selectionRows = [
  { student: 'Amaan Shaikh', company: 'Infosys', role: 'Support Engineer', status: 'Selected' },
  { student: 'Rohan Borse', company: 'TCS', role: 'Data Analyst', status: 'Selected' },
  { student: 'Neha Jadhav', company: 'Capgemini', role: 'QA Engineer', status: 'Rejected' },
  { student: 'Priya Kulkarni', company: 'Wipro', role: 'Software Engineer', status: 'Selected' },
];

const companyWise = [
  { company: 'Infosys', selected: 28, rejected: 17 },
  { company: 'TCS', selected: 19, rejected: 12 },
  { company: 'Wipro', selected: 16, rejected: 8 },
  { company: 'Capgemini', selected: 12, rejected: 14 },
];

export default function AdminSelectionsPage(): React.ReactElement {
  return (
    <section className='space-y-6'>
      <div className='space-y-1'>
        <h1 className='text-2xl font-semibold tracking-tight'>Selections Dashboard</h1>
        <p className='text-sm text-muted-foreground'>Monitor selected and rejected outcomes across all participating companies.</p>
      </div>

      <div className='grid gap-4 md:grid-cols-3'>
        <Card className='transition-shadow hover:shadow-md'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-base'>Total Selected</CardTitle>
          </CardHeader>
          <CardContent className='flex items-center justify-between'>
            <p className='text-2xl font-semibold'>75</p>
            <BadgeCheck className='h-5 w-5 text-primary' />
          </CardContent>
        </Card>
        <Card className='transition-shadow hover:shadow-md'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-base'>Total Rejected</CardTitle>
          </CardHeader>
          <CardContent className='flex items-center justify-between'>
            <p className='text-2xl font-semibold'>51</p>
            <CircleX className='h-5 w-5 text-muted-foreground' />
          </CardContent>
        </Card>
        <Card className='transition-shadow hover:shadow-md'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-base'>Placement Ratio</CardTitle>
          </CardHeader>
          <CardContent className='flex items-center justify-between'>
            <p className='text-2xl font-semibold'>59.5%</p>
            <Trophy className='h-5 w-5 text-primary' />
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-4 lg:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Latest Decisions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='rounded-md border'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectionRows.map((item, index) => (
                    <TableRow key={`${item.student}-${index}`} className='transition-colors hover:bg-muted/50'>
                      <TableCell className='font-medium'>{item.student}</TableCell>
                      <TableCell>{item.company}</TableCell>
                      <TableCell>{item.role}</TableCell>
                      <TableCell>
                        <Badge variant={item.status === 'Selected' ? 'default' : 'secondary'}>{item.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Company-wise Selection List</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            {companyWise.map((item) => (
              <div key={item.company} className='rounded-md border p-4 transition-colors hover:bg-muted/50'>
                <div className='flex items-center justify-between'>
                  <p className='font-medium'>{item.company}</p>
                  <Badge variant='outline'>{item.selected + item.rejected} total</Badge>
                </div>
                <div className='mt-2 flex items-center gap-3 text-sm text-muted-foreground'>
                  <span>Selected: {item.selected}</span>
                  <span>Rejected: {item.rejected}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
