'use client';

import { Toaster } from 'sonner';

import { ThemeProvider } from '@/components/theme-provider';

export function Providers({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
      {children}
      <Toaster position='top-right' />
    </ThemeProvider>
  );
}

