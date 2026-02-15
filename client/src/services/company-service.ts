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

const getUserData = (): { fullName?: string; email?: string } => {
  if (typeof window === 'undefined') return {};
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : {};
  } catch {
    return {};
  }
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

export interface CompanyProfile {
  _id: string;
  companyName: string;
  email: string;
  description?: string;
  website?: string;
  location?: string;
  industry?: string;
  user: {
    _id: string;
    fullName: string;
    email: string;
    status: string;
  };
  createdAt: string;
}

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
  skillsRequired?: string[];
  experienceRequired?: string;
  jobType?: string;
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
  createdAt: string;
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

export interface ApplicationSummary {
  all: number;
  applied: number;
  shortlisted: number;
  rejected: number;
  selected: number;
}

export const companyService = {
  getMyProfile: (): Promise<CompanyProfile> => {
    const userData = getUserData();
    return Promise.resolve({
      _id: '',
      companyName: userData.fullName || 'Company',
      email: userData.email || '',
      user: {
        _id: '',
        fullName: userData.fullName || 'Company',
        email: userData.email || '',
        status: 'active',
      },
      createdAt: new Date().toISOString(),
    });
  },

  updateProfile: (companyId: string, data: Partial<CompanyProfile>): Promise<CompanyProfile> =>
    apiClient(`/company/${companyId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      accessToken: getAccessToken(),
    }),

  listJobs: async (page = 1, limit = 20): Promise<JobListResponse> => {
    try {
      const data = await apiClient<JobListResponse>(`/jobs${buildQuery({ page, limit })}`, {
        accessToken: getAccessToken(),
      });
      return data;
    } catch (error) {
      console.error('Failed to load jobs:', error);
      return { items: [], pagination: { page, limit, total: 0, totalPages: 0 } };
    }
  },

  getJob: (jobId: string): Promise<Job> =>
    apiClient(`/jobs/${jobId}`, {
      accessToken: getAccessToken(),
    }),

  createJob: (data: {
    title: string;
    description: string;
    location: string;
    packageLpa: number;
    eligibility: string;
    deadline: string;
    skillsRequired?: string[];
    experienceRequired?: string;
    jobType?: string;
  }): Promise<Job> =>
    apiClient('/jobs', {
      method: 'POST',
      body: JSON.stringify(data),
      accessToken: getAccessToken(),
    }),

  updateJob: (jobId: string, data: Partial<Job>): Promise<Job> =>
    apiClient(`/jobs/${jobId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      accessToken: getAccessToken(),
    }),

  deleteJob: (jobId: string): Promise<void> =>
    apiClient(`/jobs/${jobId}`, {
      method: 'DELETE',
      accessToken: getAccessToken(),
    }),

  closeJob: (jobId: string): Promise<Job> =>
    apiClient(`/jobs/${jobId}/close`, {
      method: 'PATCH',
      accessToken: getAccessToken(),
    }),

  getApplications: async (page = 1, limit = 20, filters?: { status?: string; jobId?: string }): Promise<ApplicationListResponse> => {
    try {
      const queryFilters: Record<string, string | number> = { page, limit };
      if (filters?.status) queryFilters.status = filters.status;
      if (filters?.jobId) queryFilters.jobId = filters.jobId;
      
      return apiClient(`/applications${buildQuery(queryFilters)}`, {
        accessToken: getAccessToken(),
      });
    } catch (error) {
      console.error('Failed to load applications:', error);
      return { items: [], pagination: { page, limit, total: 0, totalPages: 0 } };
    }
  },

  getApplicationSummary: async (): Promise<ApplicationSummary> => {
    try {
      const data = await apiClient<ApplicationListResponse>('/applications?page=1&limit=100', {
        accessToken: getAccessToken(),
      });
      
      const summary: ApplicationSummary = {
        all: data.items.length,
        applied: 0,
        shortlisted: 0,
        rejected: 0,
        selected: 0,
      };
      
      for (const app of data.items) {
        if (app.status === 'applied') summary.applied++;
        else if (app.status === 'shortlisted') summary.shortlisted++;
        else if (app.status === 'rejected') summary.rejected++;
        else if (app.status === 'selected') summary.selected++;
      }
      
      return summary;
    } catch {
      return { all: 0, applied: 0, shortlisted: 0, rejected: 0, selected: 0 };
    }
  },

  updateApplicationStatus: (applicationId: string, status: 'shortlisted' | 'rejected' | 'selected'): Promise<Application> =>
    apiClient(`/applications/${applicationId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
      accessToken: getAccessToken(),
    }),
};
