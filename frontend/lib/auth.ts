import { apiRequest, tokenStorage } from './api';
import { AuthResponse, User, UserRole } from './types';

export async function register(data: {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
}): Promise<AuthResponse> {
  const res = await apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
    auth: false,
  });
  tokenStorage.set(res.accessToken, res.refreshToken);
  return res;
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
