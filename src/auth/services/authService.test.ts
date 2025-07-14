import bcrypt from "bcrypt";
import AuthService from "./authService";
import AuthRepository from "../repositories/authRepository";
import TokenService from "./tokenService";
import { User } from "@prisma/client";

jest.mock("../repositories/AuthRepository");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("./TokenService");

const mockAuthRepository = AuthRepository as jest.MockedClass<
  typeof AuthRepository
>;
const mockTokenService = TokenService as jest.MockedClass<typeof TokenService>;
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe("AuthService", () => {
  let authService: AuthService;
  const mockUser: User = {
    id: 1,
    email: "test@example.com",
    password: "hashedPassword",
    name: "Test User",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    authService = new AuthService(new mockAuthRepository());
  });

  describe("login", () => {
    it("should return user and token with valid credentials", async () => {
      // Arrange
      mockAuthRepository.prototype.findByEmail.mockResolvedValue(mockUser);
      mockBcrypt.compare.mockResolvedValue(true as never);
      mockTokenService.prototype.generateToken.mockReturnValue("test-token");

      // Act
      const result = await authService.login("test@example.com", "password");

      // Assert
      expect(result.user).toEqual(mockUser);
      expect(result.token).toBe("test-token");
      expect(mockAuthRepository.prototype.findByEmail).toHaveBeenCalledWith(
        "test@example.com"
      );
      expect(mockBcrypt.compare).toHaveBeenCalledWith(
        "password",
        "hashedPassword"
      );
    });

    it("should throw error for invalid password", async () => {
      mockAuthRepository.prototype.findByEmail.mockResolvedValue(mockUser);
      mockBcrypt.compare.mockResolvedValue(false as never);

      await expect(
        authService.login("test@example.com", "wrong")
      ).rejects.toThrow("Invalid password");
    });
  });

  describe("signup", () => {
    it("should create new user with hashed password", async () => {
      // Arrange
      const userData = {
        email: "new@example.com",
        password: "password",
        name: "New User",
      };

      mockAuthRepository.prototype.findByEmail.mockResolvedValue(null);
      mockAuthRepository.prototype.create.mockResolvedValue(mockUser);
      mockBcrypt.hash.mockResolvedValue("hashedPassword" as never);
      mockTokenService.prototype.generateToken.mockReturnValue("test-token");

      // Act
      const result = await authService.signup(userData);

      // Assert
      expect(mockBcrypt.hash).toHaveBeenCalledWith("password", 10);
      expect(mockAuthRepository.prototype.create).toHaveBeenCalledWith({
        ...userData,
        password: "hashedPassword",
      });
      expect(result.token).toBe("test-token");
    });

    it("should throw error for existing email", async () => {
      mockAuthRepository.prototype.findByEmail.mockResolvedValue(mockUser);

      await expect(
        authService.signup({
          email: "test@example.com",
          password: "password",
          name: "Test User",
        })
      ).rejects.toThrow("Email already exists");
    });
  });
});
