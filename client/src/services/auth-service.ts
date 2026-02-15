import { apiClient } from '@/api/base-api';
import { type IAuthResponse, type ILoginDto } from '@/types/auth';

export const authService = {
  login: (payload: ILoginDto): Promise<IAuthResponse> =>
    apiClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  logout: (refreshToken: string): Promise<void> =>
    apiClient('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }),
};

