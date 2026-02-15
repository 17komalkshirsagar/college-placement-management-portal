'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { authService } from '@/services/auth-service';
import { type ILoginDto, type UserRole } from '@/types/auth';

const ROLE_ROUTE_MAP: Record<UserRole, string> = {
  admin: '/admin',
  company: '/company',
  student: '/student',
};

export function useAuth(): {
  isLoading: boolean;
  login: (payload: ILoginDto) => Promise<void>;
} {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const login = async (payload: ILoginDto): Promise<void> => {
    setIsLoading(true);
    try {
      const result = await authService.login(payload);
      document.cookie = `app_role=${result.user.role}; path=/`;
      localStorage.setItem('access_token', result.tokens.accessToken);
      localStorage.setItem('refresh_token', result.tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(result.user));
      toast.success('Login successful');
      router.push(ROLE_ROUTE_MAP[result.user.role]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to login');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, login };
}

