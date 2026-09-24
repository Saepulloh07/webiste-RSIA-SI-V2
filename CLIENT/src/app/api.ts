/**
 * RSIA Sayang Ibu — API Client Service
 * Authoritative client for communication with NestJS REST API Backend.
 */

export const API_BASE_URL =
  (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export const SERVER_BASE_URL =
  (import.meta as any).env?.VITE_SERVER_BASE_URL || 'http://localhost:5000';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage?: boolean;
    hasPrevPage?: boolean;
  };
}

export interface ApiError {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  code?: string;
}

export type AdminRole = "Super Admin" | "Admin" | "Editor";

export function normalizeRole(role?: string | null): AdminRole {
  if (!role) return "Editor";
  const cleaned = String(role).toUpperCase().replace(/[\s_-]+/g, '');
  if (cleaned.includes('SUPER')) return "Super Admin";
  if (cleaned.includes('ADMIN')) return "Admin";
  return "Editor";
}

export function getAdminRole(): AdminRole {
  return normalizeRole(localStorage.getItem('adminRole'));
}

export function getAuthToken(): string | null {
  return localStorage.getItem('token') || localStorage.getItem('authToken');
}

export function setAuthSession(token: string, refreshToken?: string, role?: string, user?: any) {
  const normRole = normalizeRole(role || user?.role);
  localStorage.setItem('token', token);
  localStorage.setItem('authToken', token);
  localStorage.setItem('isAdminLoggedIn', 'true');
  if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
  localStorage.setItem('adminRole', normRole);
  if (user) {
    localStorage.setItem('adminUser', JSON.stringify({ ...user, role: normRole }));
  }
}

export function clearAuthSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('authToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('isAdminLoggedIn');
  localStorage.removeItem('adminRole');
  localStorage.removeItem('adminUser');
}

/**
 * Core fetch wrapper with automatic Bearer token injection and JSON error parsing.
 */
async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Handle FormData vs JSON content type
  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // Support full URLs or endpoints relative to API_BASE_URL
  const url = endpoint.startsWith('http://') || endpoint.startsWith('https://')
    ? endpoint
    : `${API_BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const responseText = await response.text();
  let json: any = null;

  try {
    json = responseText ? JSON.parse(responseText) : {};
  } catch {
    json = { message: responseText || response.statusText };
  }

  if (!response.ok) {
    if (response.status === 401 && endpoint !== 'auth/login') {
      clearAuthSession();
    }
    const errorMessage =
      json?.message ||
      (json?.errors ? Object.values(json.errors).flat().join(', ') : 'Terjadi kesalahan pada server');
    const error: Error & { details?: any; status?: number } = new Error(errorMessage);
    error.details = json;
    error.status = response.status;
    throw error;
  }

  return json;
}

// -----------------------------------------------------------------------------
// MODULE APIS
// -----------------------------------------------------------------------------

export const api = {
  // Auth API
  auth: {
    login: (credentials: { email: string; password: string }) =>
      request<{
        token: string;
        refreshToken: string;
        user: { id: string; name: string; email: string; role: string; lastLogin?: string };
      }>('auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    me: () =>
      request<{ id: string; name: string; email: string; role: string; lastLogin?: string }>('auth/me'),
    logout: () =>
      request('auth/logout', { method: 'POST' }).catch(() => {
        // Silently handle stateless logout error
      }),
  },

  // Doctors API
  doctors: {
    getAll: (params?: { specialty?: string; status?: string; search?: string; limit?: number; page?: number }) => {
      const q = new URLSearchParams();
      if (params?.specialty) q.set('specialty', params.specialty);
      if (params?.status) q.set('status', params.status);
      if (params?.search) q.set('search', params.search);
      if (params?.limit) q.set('limit', String(params.limit));
      if (params?.page) q.set('page', String(params.page));
      const queryStr = q.toString() ? `?${q.toString()}` : '';
      return request<any[]>(`doctors${queryStr}`);
    },
    getOne: (slugOrId: string) => request<any>(`doctors/${slugOrId}`),
    create: (data: any) =>
      request('doctors', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      request(`doctors/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request(`doctors/${id}`, {
        method: 'DELETE',
      }),
  },

  // Services API
  services: {
    getAll: (params?: { category?: string; status?: string; search?: string; limit?: number; page?: number }) => {
      const q = new URLSearchParams();
      if (params?.category) q.set('category', params.category);
      if (params?.status) q.set('status', params.status);
      if (params?.search) q.set('search', params.search);
      if (params?.limit) q.set('limit', String(params.limit));
      if (params?.page) q.set('page', String(params.page));
      const queryStr = q.toString() ? `?${q.toString()}` : '';
      return request<any[]>(`services${queryStr}`);
    },
    getOne: (slugOrId: string) => request<any>(`services/${slugOrId}`),
    create: (data: any) =>
      request('services', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      request(`services/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request(`services/${id}`, {
        method: 'DELETE',
      }),
  },

  // Articles API
  articles: {
    getAll: (params?: { category?: string; status?: string; search?: string; limit?: number; page?: number; all?: boolean }) => {
      const q = new URLSearchParams();
      if (params?.category) q.set('category', params.category);
      if (params?.status && params.status !== 'all') q.set('status', params.status);
      if (params?.search) q.set('search', params.search);
      if (params?.limit) q.set('limit', String(params.limit));
      if (params?.page) q.set('page', String(params.page));
      if (params?.all) q.set('all', 'true');
      const queryStr = q.toString() ? `?${q.toString()}` : '';
      return request<any[]>(`articles${queryStr}`);
    },
    getOne: (slugOrId: string, all?: boolean) =>
      request<any>(`articles/${slugOrId}${all ? '?all=true' : ''}`),
    create: (data: any) =>
      request('articles', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      request(`articles/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request(`articles/${id}`, {
        method: 'DELETE',
      }),
  },

  // Ads & Promos API
  ads: {
    getAll: (params?: { status?: string; search?: string; limit?: number; page?: number }) => {
      const q = new URLSearchParams();
      if (params?.status && params.status !== 'all') q.set('status', params.status);
      if (params?.search) q.set('search', params.search);
      if (params?.limit) q.set('limit', String(params.limit));
      if (params?.page) q.set('page', String(params.page));
      const queryStr = q.toString() ? `?${q.toString()}` : '';
      return request<any[]>(`ads${queryStr}`);
    },
    getOne: (slugOrId: string) => request<any>(`ads/${slugOrId}`),
    create: (data: any) =>
      request('ads', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      request(`ads/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request(`ads/${id}`, {
        method: 'DELETE',
      }),
  },

  // Job Vacancies API
  vacancies: {
    getAll: (params?: { department?: string; type?: string; status?: string; search?: string; limit?: number; page?: number; all?: boolean }) => {
      const q = new URLSearchParams();
      if (params?.department) q.set('department', params.department);
      if (params?.type) q.set('type', params.type);
      if (params?.status && params.status !== 'all') q.set('status', params.status);
      if (params?.search) q.set('search', params.search);
      if (params?.limit) q.set('limit', String(params.limit));
      if (params?.page) q.set('page', String(params.page));
      if (params?.all) q.set('all', 'true');
      const queryStr = q.toString() ? `?${q.toString()}` : '';
      return request<any[]>(`vacancies${queryStr}`);
    },
    getOne: (slugOrId: string, all?: boolean) =>
      request<any>(`vacancies/${slugOrId}${all ? '?all=true' : ''}`),
    create: (data: any) =>
      request('vacancies', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      request(`vacancies/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request(`vacancies/${id}`, {
        method: 'DELETE',
      }),
  },

  // Appointments (Pendaftaran Online Antrean Pasien) API
  appointments: {
    getAll: (params?: { status?: string; search?: string; date?: string; limit?: number; page?: number }) => {
      const q = new URLSearchParams();
      if (params?.status && params.status !== 'all') q.set('status', params.status);
      if (params?.search) q.set('search', params.search);
      if (params?.date) q.set('date', params.date);
      if (params?.limit) q.set('limit', String(params.limit));
      if (params?.page) q.set('page', String(params.page));
      const queryStr = q.toString() ? `?${q.toString()}` : '';
      return request<any[]>(`appointments${queryStr}`);
    },
    getOne: (id: string) => request<any>(`appointments/${id}`),
    create: (data: any) =>
      request('appointments', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      request(`appointments/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request(`appointments/${id}`, {
        method: 'DELETE',
      }),
  },

  // Media Library API
  media: {
    getAll: (params?: { type?: string; search?: string; limit?: number; page?: number }) => {
      const q = new URLSearchParams();
      if (params?.type && params.type !== 'all') q.set('type', params.type);
      if (params?.search) q.set('search', params.search);
      if (params?.limit) q.set('limit', String(params.limit));
      if (params?.page) q.set('page', String(params.page));
      const queryStr = q.toString() ? `?${q.toString()}` : '';
      return request<any[]>(`media${queryStr}`);
    },
    upload: (file: File, type?: string, description?: string) => {
      const formData = new FormData();
      formData.append('file', file);
      if (type) formData.append('type', type);
      if (description) formData.append('description', description);
      return request<{ id: string; name: string; type: string; url: string; size: string; date: string }>(
        'media/upload',
        {
          method: 'POST',
          body: formData,
        }
      );
    },
    delete: (id: string) =>
      request(`media/${id}`, {
        method: 'DELETE',
      }),
  },

  // Settings API
  settings: {
    getHospital: () => request<any>('settings'),
    updateHospital: (data: any) =>
      request('settings', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    getRegistration: () => request<{ isOpen: boolean; maxDailyQuota: number; noticeMessage?: string }>('settings/registration'),
    updateRegistration: (data: { isOpen: boolean; maxDailyQuota: number; noticeMessage?: string }) =>
      request('settings/registration', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },

  // Users Management API (Super Admin)
  users: {
    getAll: (params?: { role?: string; search?: string; limit?: number; page?: number }) => {
      const q = new URLSearchParams();
      if (params?.role) q.set('role', params.role);
      if (params?.search) q.set('search', params.search);
      if (params?.limit) q.set('limit', String(params.limit));
      if (params?.page) q.set('page', String(params.page));
      const queryStr = q.toString() ? `?${q.toString()}` : '';
      return request<any[]>(`users${queryStr}`);
    },
    create: (data: any) =>
      request('users', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      request(`users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request(`users/${id}`, {
        method: 'DELETE',
      }),
  },

  // Dashboard Stats API
  dashboard: {
    getStats: () =>
      request<{
        totalDoctors: number;
        activeDoctors: number;
        totalServices: number;
        totalArticles: number;
        publishedArticles: number;
        activeAds: number;
        totalVacancies: number;
        publishedVacancies: number;
        totalMedia: number;
        totalAppointments: number;
        totalAppointmentsToday: number;
        recentAppointments: Array<{
          id: string;
          patientName: string;
          doctorName: string;
          date: string;
          status: string;
        }>;
      }>('dashboard/stats'),
  },

  // SIMRS Queue & Booking Bridge
  simrs: {
    getPoliklinik: () => request<any[]>('poliklinik'),
    register: (data: any) =>
      request('register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    check: (credentials: { no_booking: string; no_telp: string }) =>
      request('check', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    checkQueue: (credentials: { no_booking: string; no_telp: string }) =>
      request('api/queue/check', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    myQueue: () => request('api/queue/my-queue'),
  },
};
