import { User } from "@prisma/client";

export interface IAuthService {
  login(email: string, password: string): Promise<AuthResponse>;
  signup(userData: SignupData): Promise<AuthResponse>;
  forgotPassword(email: string): Promise<void>;
  resetPassword(token: string, newPassword: string): Promise<void>;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
}
