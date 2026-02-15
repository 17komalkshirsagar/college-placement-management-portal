import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function NotFoundPage(): React.ReactElement {
  return (
    <div className='min-h-screen bg-background/90 px-6 py-12 text-center'>
      <div className='mx-auto max-w-xl rounded-2xl border border-border bg-card p-10 shadow-lg'>
        <p className='text-lg font-medium text-muted-foreground'>Page not found</p>
        <h1 className='mt-4 text-4xl font-semibold tracking-tight'>We couldn&apos;t locate that page.</h1>
        <p className='mt-2 text-sm text-muted-foreground'>
          The page you are looking for might have moved or the URL could be incorrect. Return to the placement portal homepage to continue.
        </p>
        <div className='mt-6 flex justify-center'>
          <Button asChild>
            <Link href='/'>Go to homepage</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
