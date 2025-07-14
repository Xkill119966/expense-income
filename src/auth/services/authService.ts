import { User } from "@prisma/client";
import bcrypt from "bcrypt";

import AuthRepository from "../repositories/authRepository";
import {
  IAuthService,
  AuthResponse,
  SignupData,
} from "../interfaces/IAuthService";
import TokenService from "./tokenService";
import { Mailer } from "../../helpers/mailService";
import ResetPasswordMailable from "../../mailables/reset-password.mailable";

class AuthService implements IAuthService {
  private tokenService: TokenService;
  private mailer: Mailer;

  constructor(private readonly authRepository: AuthRepository) {
    this.tokenService = new TokenService();
    this.mailer = new Mailer();
  }

  public async login(email: string, password: string): Promise<AuthResponse> {
    const user = await this.findAndValidateUser(email, password);
    const token = this.tokenService.generateToken(user);

    return this.createAuthResponse(user, token);
  }

  public async signup(userData: SignupData): Promise<AuthResponse> {
    await this.validateNewUser(userData.email);

    const user = await this.createUser(userData);
    const token = this.tokenService.generateToken(user);

    return this.createAuthResponse(user, token);
  }

  private async findAndValidateUser(
    email: string,
    password: string
  ): Promise<User> {
    const user = await this.findUserOrThrow(email);
    await this.validatePassword(password, user.password);
    return user;
  }

  private async validateNewUser(email: string): Promise<void> {
    const existingUser = await this.authRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("Email already exists");
    }
  }

  private async createUser(userData: SignupData): Promise<User> {
    const hashedPassword = await this.hashPassword(userData.password);
    return this.authRepository.create({
      ...userData,
      password: hashedPassword,
    });
  }

  private async findUserOrThrow(email: string): Promise<User> {
    const user = await this.authRepository.findByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  private async validatePassword(
    password: string,
    hashedPassword: string
  ): Promise<void> {
    const isValid = await bcrypt.compare(password, hashedPassword);
    if (!isValid) {
      throw new Error("Invalid password");
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private createAuthResponse(user: User, token: string): AuthResponse {
    return { user, token };
  }
}

export default AuthService;
