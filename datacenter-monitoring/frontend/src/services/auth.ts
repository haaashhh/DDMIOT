const API_BASE_URL = 'http://localhost:5001/api/v1';

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'admin' | 'user' | 'viewer';
  is_active: boolean;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
    expires_in: string;
  };
}

export interface AuthError {
  success: false;
  message: string;
  errors?: any[];
}

class AuthService {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage on initialization
    this.token = localStorage.getItem('auth_token');
  }

  async login(email: string, password: string): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data: LoginResponse | AuthError = await response.json();

      if (!response.ok || !data.success) {
        throw new Error((data as AuthError).message || 'Login failed');
      }

      const loginData = data as LoginResponse;
      
      // Store token and user data
      this.token = loginData.data.token;
      localStorage.setItem('auth_token', this.token);
      localStorage.setItem('user_data', JSON.stringify(loginData.data.user));

      return loginData.data.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(userData: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role?: 'admin' | 'user' | 'viewer';
  }): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data: LoginResponse | AuthError = await response.json();

      if (!response.ok || !data.success) {
        throw new Error((data as AuthError).message || 'Registration failed');
      }

      const registerData = data as LoginResponse;
      
      // Store token and user data
      this.token = registerData.data.token;
      localStorage.setItem('auth_token', this.token);
      localStorage.setItem('user_data', JSON.stringify(registerData.data.user));

      return registerData.data.user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async getProfile(): Promise<User> {
    try {
      if (!this.token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to get profile');
      }

      // Update stored user data
      localStorage.setItem('user_data', JSON.stringify(data.data.user));

      return data.data.user;
    } catch (error) {
      console.error('Profile fetch error:', error);
      throw error;
    }
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getStoredUser(): User | null {
    try {
      const userData = localStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  // Helper method to get authorization headers
  getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Method to check if token is expired (basic check)
  isTokenExpired(): boolean {
    if (!this.token) return true;

    try {
      // Decode JWT payload (basic decode without verification)
      const payload = JSON.parse(atob(this.token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  }
}

export const authService = new AuthService();