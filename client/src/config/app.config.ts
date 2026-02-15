export const appConfig = {
  appName: 'College Placement Management System',
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL ?? '',
} as const;

if (!appConfig.backendUrl) {
  throw new Error('NEXT_PUBLIC_BACKEND_URL is not configured.');
}

