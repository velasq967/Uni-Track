import api from '@/lib/api';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  studentId?: string;
  university?: string;
  major?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  studentId?: string;
  university?: string;
  major?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    const { access_token, user } = response.data;
    
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    const { access_token, user } = response.data;
    
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data;
  },

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  },

  getCurrentUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  },

  getToken(): string | null {
    return localStorage.getItem('access_token');
  },
};
