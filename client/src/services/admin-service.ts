import { apiClient } from '@/api/base-api';

const getAccessToken = (): string => {
  if (typeof window === 'undefined') {
    throw new Error('Authentication token is unavailable on the server');
  }

  const token = window.localStorage.getItem('access_token');
  if (!token) {
    throw new Error('Authentication required for this action');
  }

  return token;
};

const buildQuery = (params?: Record<string, string | number | boolean | undefined>): string => {
  if (!params) return '';
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, value.toString());
    }
  });
  return query.toString() ? `?${query}` : '';
};

export interface CompanySummary {
  _id: string;
  companyName: string;
  hrEmail: string;
  hrMobileNumber: string;
  isActive: boolean;
  createdAt: string;
  user: {
    _id: string;
    email: string;
    status: 'active' | 'inactive';
    fullName?: string;
  } | null;
}

export interface CompanyDetails extends CompanySummary {
  jobsPosted: number;
  updatedAt: string;
}

export interface StudentSummary {
  _id: string;
  fullName?: string;
  course: string;
  branch: string;
  year: number;
  user: {
    _id: string;
    email: string;
    status: 'active' | 'inactive';
    fullName?: string;
  };
  createdAt: string;
}

export interface PaginationPayload {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationPayload;
}

export type CreateCompanyPayload = {
  companyName: string;
  hrEmail: string;
  hrMobileNumber: string;
  website?: string;
  industry?: string;
  headquarters?: string;
};

export type CreateStudentPayload = {
  fullName: string;
  email: string;
  mobileNumber: string;
  course: string;
  branch: string;
  year: number;
};

export const adminService = {
  listCompanies: (page = 1, limit = 10, isActive?: boolean): Promise<PaginatedResponse<CompanySummary>> =>
    apiClient(
      `/companies${buildQuery({
        page,
        limit,
        isActive: typeof isActive === 'boolean' ? isActive : undefined,
      })}`,
      {
        accessToken: getAccessToken(),
      }
    ),

  createCompany: (payload: CreateCompanyPayload): Promise<{ id: string; message: string }> =>
    apiClient('/users/companies', {
      method: 'POST',
      body: JSON.stringify(payload),
      accessToken: getAccessToken(),
    }),

  toggleCompanyActivation: (companyId: string, isActive: boolean): Promise<CompanySummary> =>
    apiClient(`/companies/${companyId}/activation`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
      accessToken: getAccessToken(),
    }),
 
  updateCompany: (companyId: string, payload: Partial<Pick<CompanySummary, 'companyName' | 'hrEmail' | 'hrMobileNumber' | 'isActive'>>) =>
    apiClient(`/admin/companies/${companyId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
      accessToken: getAccessToken(),
    }),

  updateCompanyStatus: (companyId: string, isActive: boolean) =>
    apiClient(`/admin/companies/${companyId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
      accessToken: getAccessToken(),
    }),

  deleteCompany: (companyId: string) =>
    apiClient(`/admin/companies/${companyId}`, {
      method: 'DELETE',
      accessToken: getAccessToken(),
    }),

  getCompany: (companyId: string): Promise<CompanyDetails> =>
    apiClient(`/admin/companies/${companyId}`, {
      accessToken: getAccessToken(),
    }),

  listStudents: (page = 1, limit = 10): Promise<PaginatedResponse<StudentSummary>> =>
    apiClient(`/students${buildQuery({ page, limit })}`, {
      accessToken: getAccessToken(),
    }),

  createStudent: (payload: CreateStudentPayload): Promise<{ id: string; message: string }> =>
    apiClient('/users/students', {
      method: 'POST',
      body: JSON.stringify(payload),
      accessToken: getAccessToken(),
    }),

  updateStudentProfile: (studentId: string, payload: { course?: string; branch?: string; year?: number }) =>
    apiClient(`/students/${studentId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
      accessToken: getAccessToken(),
    }),

  updateUserStatus: (userId: string, status: 'active' | 'inactive'): Promise<{ id: string; message: string }> =>
    apiClient(`/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
      accessToken: getAccessToken(),
    }),

  deleteStudent: (studentId: string): Promise<{ message: string }> =>
    apiClient(`/students/${studentId}`, {
      method: 'DELETE',
      accessToken: getAccessToken(),
    }),
};
