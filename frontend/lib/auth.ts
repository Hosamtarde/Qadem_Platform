import { apiRequest, tokenStorage } from './api';
import { AuthResponse, User, UserRole } from './types';

export interface RegisterResponse {
  message: string;
  email: string;
}

export async function register(data: {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
}): Promise<RegisterResponse> {
  return apiRequest<RegisterResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
    auth: false,
  });
}

export async function login(data: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const res = await apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
    auth: false,
  });
  tokenStorage.set(res.accessToken, res.refreshToken);
  return res;
}

export async function logout(): Promise<void> {
  try {
    await apiRequest('/auth/logout', { method: 'POST' });
  } finally {
    tokenStorage.clear();
  }
}

export async function getMe(): Promise<User> {
  return apiRequest<User>('/auth/me');
}

export async function verifyEmail(token: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(
    `/auth/verify-email?token=${encodeURIComponent(token)}`,
    { auth: false },
  );
}

export async function resendVerification(
  email: string,
): Promise<{ message: string }> {
  return apiRequest<{ message: string }>('/auth/resend-verification', {
    method: 'POST',
    body: JSON.stringify({ email }),
    auth: false,
  });
}
