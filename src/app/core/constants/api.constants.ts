const getBackendBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:8080';
    }
  }
  return 'https://racines-app-back.onrender.com';
};

export const API_BASE_URL = `${getBackendBaseUrl()}/api`;
export const BACKEND_BASE_URL = getBackendBaseUrl();

export const API_ENDPOINTS = {
  API_BASE_URL,
  BACKEND_BASE_URL,
  AUTH: {
    SUCCESS: '/auth/success',
    ME: '/auth/me',
    FAILURE: '/auth/failure',
    LOGIN_INITIATE: '/auth/login/initiate',
    LOGIN_VERIFY_OTP: '/auth/login/verify-otp',
    LOGIN_VERIFY_PASSWORD: '/auth/login/verify-password',
    ADMIN_REQUEST_OTP: '/auth/admin/request-otp',
    LOGOUT: '/auth/logout'
  },
  PERSONS: {
    BASE: '/persons',
    BY_ID: (id: string) => `/persons/${id}`,
    FAMILY_TREE: (id: string) => `/persons/${id}/family-tree`,
    PUBLIC_TREE: '/persons/public/tree',
    EXPORT: (id: string) => `/persons/${id}/family-tree/export`,
    ANCESTORS: (id: string) => `/persons/${id}/ancestors`,
    DESCENDANTS: (id: string) => `/persons/${id}/descendants`,
    RELATIONSHIPS: (id: string) => `/persons/${id}/relationships`
  },
  PROFILE_CLAIMS: {
    BASE: '/profile-claims',
    BY_ID: (id: string) => `/profile-claims/${id}`,
    APPROVE: (id: string) => `/profile-claims/${id}/approve`,
    REJECT: (id: string) => `/profile-claims/${id}/reject`
  },
  VALIDATIONS: {
    REQUEST: '/validations/request',
    PENDING: '/validations/pending',
    BY_ID: (id: string) => `/validations/${id}`,
    APPROVE: (id: string) => `/validations/${id}/approve`,
    REJECT: (id: string) => `/validations/${id}/reject`
  },
  SYNC: {
    QUEUE: '/sync/queue',
    EXECUTE: '/sync/execute',
    STATUS: '/sync/status'
  }
} as const;
