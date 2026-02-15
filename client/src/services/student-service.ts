import { apiClient } from '@/api/base-api';

const getAccessToken = (): string => {
  if (typeof window === 'undefined') {
    throw new Error('Authentication token unavailable');
  }
  const token = window.localStorage.getItem('access_token');
  if (!token) {
    throw new Error('Authentication is required');
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

export interface StudentProfile {
  _id: string;
  user: {
    _id: string;
    fullName: string;
    email: string;
    status: 'active' | 'inactive';
  };
  mobileNumber: string;
  course: string;
  branch: string;
  year: number;
  skills?: string[];
  resumeUrl?: string | null;
  resumeUpdatedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StudentApplicationSummary {
  _id: string;
  job: {
    title: string;
    location: string;
    company: {
      companyName: string;
    };
  };
  status: 'applied' | 'shortlisted' | 'rejected' | 'selected';
  createdAt: string;
  decisionHistory?: Array<{ status: string; updatedAt: string }>;
}

export const studentService = {
  getProfile: (studentId: string): Promise<StudentProfile> =>
    apiClient(`/students/${studentId}`, {
      accessToken: getAccessToken(),
    }),

  getMyProfile: (): Promise<StudentProfile> =>
    apiClient('/students/me', {
      accessToken: getAccessToken(),
    }),

  updateProfile: (studentId: string, payload: Partial<Pick<StudentProfile, 'mobileNumber' | 'course' | 'branch' | 'year' | 'user'>>): Promise<StudentProfile> =>
    apiClient(`/students/${studentId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
      accessToken: getAccessToken(),
    }),

  uploadResume: (studentId: string, data: FormData): Promise<StudentProfile> =>
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/students/${studentId}/resume`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
      body: data,
    }).then(async (res) => {
      if (!res.ok) {
        const payload = await res.json().catch(() => ({ message: 'Upload failed' }));
        throw new Error(payload.message ?? 'Upload failed');
      }
      return res.json();
    }),

  deleteResume: (studentId: string): Promise<StudentProfile> =>
    apiClient(`/students/${studentId}/resume`, {
      method: 'DELETE',
      accessToken: getAccessToken(),
    }),

  deleteMyProfile: (): Promise<{ message: string }> =>
    apiClient('/students/me', {
      method: 'DELETE',
      accessToken: getAccessToken(),
    }),

  addSkill: (studentId: string, skill: string): Promise<StudentProfile> =>
    apiClient(`/students/${studentId}/skills`, {
      method: 'POST',
      body: JSON.stringify({ skill }),
      accessToken: getAccessToken(),
    }),

  removeSkill: (studentId: string, skill: string): Promise<StudentProfile> =>
    apiClient(`/students/${studentId}/skills`, {
      method: 'DELETE',
      body: JSON.stringify({ skill }),
      accessToken: getAccessToken(),
    }),

  listApplications: (page = 1, limit = 10) =>
    apiClient(`/applications${buildQuery({ page, limit })}`, {
      accessToken: getAccessToken(),
    }),
};
