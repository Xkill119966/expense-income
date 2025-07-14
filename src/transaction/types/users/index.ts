import { User } from "@prisma/client";

export interface GoogleProfile {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

export interface TokenPayload extends User {}
export interface ResetTokenPayload {
  userId: number;
  exp: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface GoogleTokens {
  access_token: string;
  id_token: string;
  token_type: string;
  expires_in: number;
}

export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
  googleId?: string;
  isEmailVerified?: boolean;
}

export interface UpdateUserDto {
  name?: string;
  googleId?: string;
  isEmailVerified?: boolean;
  resetToken?: string | null;
  resetTokenExpiry?: Date | null;
  password?: string;
}
