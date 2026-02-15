import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AuthLayout({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <main className='flex min-h-screen items-center justify-center bg-background p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-2 text-center'>
          <CardTitle className='text-2xl'>Placement Portal Login</CardTitle>
          <CardDescription>Sign in to continue with Admin, Student, or Company access.</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </main>
  );
}
