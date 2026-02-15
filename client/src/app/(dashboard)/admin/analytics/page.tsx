import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const placementByDepartment = [
  { department: 'Computer Engineering', percentage: 86 },
  { department: 'Information Technology', percentage: 82 },
  { department: 'Electronics', percentage: 74 },
  { department: 'Mechanical', percentage: 66 },
  { department: 'Civil', percentage: 58 },
];

const monthlyApplications = [180, 214, 243, 260, 284, 301, 276, 322, 339, 358, 372, 389];

const progressClass: Record<number, string> = {
  86: 'w-[86%]',
  82: 'w-[82%]',
  74: 'w-[74%]',
  66: 'w-[66%]',
  58: 'w-[58%]',
};

const chartHeightClass: Record<number, string> = {
  180: 'h-[45%]',
  214: 'h-[53%]',
  243: 'h-[60%]',
  260: 'h-[64%]',
  284: 'h-[70%]',
  301: 'h-[74%]',
  276: 'h-[68%]',
  322: 'h-[79%]',
  339: 'h-[84%]',
  358: 'h-[88%]',
  372: 'h-[92%]',
  389: 'h-[96%]',
};

export default function AdminAnalyticsPage(): React.ReactElement {
  return (
    <section className='space-y-6'>
      <div className='space-y-1'>
        <h1 className='text-2xl font-semibold tracking-tight'>Analytics</h1>
        <p className='text-sm text-muted-foreground'>Placement insights for strategic planning and progress tracking.</p>
      </div>

      <div className='grid gap-4 lg:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Placement by Department</CardTitle>
            <CardDescription>Selection percentage across key branches.</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {placementByDepartment.map((item) => (
              <div key={item.department} className='space-y-1'>
                <div className='flex items-center justify-between text-sm'>
                  <span>{item.department}</span>
                  <span className='font-medium'>{item.percentage}%</span>
                </div>
                <div className='h-2 rounded-full bg-muted'>
                  <div className={`h-2 rounded-full bg-primary transition-all duration-500 ${progressClass[item.percentage]}`} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>Monthly Applications</CardTitle>
            <CardDescription>Application volume trend over the year.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex h-56 items-end gap-2'>
              {monthlyApplications.map((value, index) => (
                <div key={`${value}-${index}`} className='group flex-1'>
                  <div className={`w-full rounded-md bg-primary/30 transition-all duration-300 group-hover:bg-primary ${chartHeightClass[value]}`} />
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
      </div>
    </section>
  );
}
