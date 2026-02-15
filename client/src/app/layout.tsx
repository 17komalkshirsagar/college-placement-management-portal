import type { Metadata } from 'next';
import { Manrope, Space_Mono } from 'next/font/google';
import { Providers } from '@/components/providers';

import './globals.css';

const sans = Manrope({ subsets: ['latin'], variable: '--font-sans' });
const mono = Space_Mono({ subsets: ['latin'], variable: '--font-mono', weight: ['400', '700'] });

export const metadata: Metadata = {
  title: 'College Placement Management System',
  description: 'Enterprise placement management portal',
};

export default function RootLayout({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${sans.variable} ${mono.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

