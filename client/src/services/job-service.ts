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

export interface Job {
  _id: string;
  title: string;
  description: string;
  location: string;
  packageLpa: number;
  eligibility: string;
  deadline: string;
  isActive: boolean;
  company: {
    _id: string;
    companyName: string;
    logo?: string;
    website?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface JobListResponse {
  items: Job[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Application {
  _id: string;
  student: {
    _id: string;
    user: {
      _id: string;
      fullName: string;
      email: string;
    };
    mobileNumber: string;
    course: string;
    branch: string;
    year: number;
    skills?: string[];
    resumeUrl?: string | null;
  };
  job: {
    _id: string;
    title: string;
    location: string;
    packageLpa: number;
    company: {
      _id: string;
      companyName: string;
    };
  };
  status: 'applied' | 'shortlisted' | 'rejected' | 'selected';
  resumeUrl: string;
  coverLetter?: string;
  decisionHistory: Array<{
    status: string;
    updatedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationListResponse {
  items: Application[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const jobService = {
  listJobs: (page = 1, limit = 20, filters?: { isActive?: boolean; location?: string; companyId?: string }): Promise<JobListResponse> =>
    apiClient(`/jobs${buildQuery({ page, limit, ...filters })}`, {}),

  listAllJobs: (page = 1, limit = 20, filters?: { isActive?: boolean; location?: string; companyId?: string }): Promise<JobListResponse> =>
    apiClient(`/jobs${buildQuery({ page, limit, ...filters })}`, {
      accessToken: getAccessToken(),
    }),

  getJob: (jobId: string): Promise<Job> =>
    apiClient(`/jobs/${jobId}`, {}),

  applyToJob: (jobId: string, resumeUrl: string, coverLetter?: string): Promise<{ id: string; message: string }> =>
    apiClient('/applications', {
      method: 'POST',
      body: JSON.stringify({ jobId, resumeUrl, coverLetter }),
      accessToken: getAccessToken(),
    }),

  closeJob: (jobId: string): Promise<Job> =>
    apiClient(`/jobs/${jobId}/close`, {
      method: 'PATCH',
      accessToken: getAccessToken(),
    }),
};

export const applicationService = {
  listMyApplications: (page = 1, limit = 20): Promise<ApplicationListResponse> =>
    apiClient(`/applications${buildQuery({ page, limit })}`, {
      accessToken: getAccessToken(),
    }),

  listByJob: (jobId: string, page = 1, limit = 20): Promise<ApplicationListResponse> =>
    apiClient(`/applications${buildQuery({ page, limit, jobId })}`, {
      accessToken: getAccessToken(),
    }),

  listForCompany: (page = 1, limit = 20): Promise<ApplicationListResponse> =>
    apiClient(`/applications${buildQuery({ page, limit })}`, {
      accessToken: getAccessToken(),
    }),

  listAll: (page = 1, limit = 20, filters?: { status?: string; jobId?: string }): Promise<ApplicationListResponse> =>
    apiClient(`/applications${buildQuery({ page, limit, ...filters })}`, {
      accessToken: getAccessToken(),
    }),

  updateStatus: (applicationId: string, status: 'shortlisted' | 'rejected' | 'selected'): Promise<Application> =>
    apiClient(`/applications/${applicationId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
      accessToken: getAccessToken(),
    }),
};
