import { Request, Response } from "express";
import AuthController from "./authController";
import AuthService from "../services/authService";
import AuthRepository from "../repositories/authRepository";
import { ResponseController } from "../../helpers/responseController";

// Proper mock for AuthRepository
jest.mock("../repositories/AuthRepository");

// Mock for AuthService
jest.mock("../services/AuthService");

// Mock for ResponseController
jest.mock("../../helpers/response-controller");

describe("AuthController", () => {
  let authController: AuthController;
  let authService: AuthService;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create instances with proper typing
    const authRepo = new AuthRepository();
    authService = new AuthService(authRepo);
    authController = new AuthController(authService);

    // Mock request/response
    mockReq = { body: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should initialize without errors", () => {
    expect(authController).toBeInstanceOf(AuthController);
    expect(authController).toBeInstanceOf(ResponseController);
  });

  describe("login()", () => {
    it("should call authService.login with correct parameters", async () => {
      // Arrange
      const credentials = { email: "test@example.com", password: "password" };
      mockReq.body = credentials;

      // Mock the service response
      (authService.login as jest.Mock).mockResolvedValue({
        user: { id: 1, ...credentials },
        token: "fake-token",
      });

      // Act
      await authController.login(mockReq as Request, mockRes as Response);

      // Assert
      expect(authService.login).toHaveBeenCalledWith(
        credentials.email,
        credentials.password
      );
    });
  });

  describe("signup()", () => {
    it("should successfully register a new user", async () => {
      // Arrange
      const newUser = {
        email: "new@example.com",
        password: "password123",
        name: "Test User",
      };
      mockReq.body = newUser;

      const mockResponse = {
        id: 1,
        email: newUser.email,
        name: newUser.name,
      };
      (authService.signup as jest.Mock).mockResolvedValue(mockResponse);

      // Act
      await authController.signup(mockReq as Request, mockRes as Response);

      // Assert
      expect(authService.signup).toHaveBeenCalledWith(newUser);
    });

    it("should handle signup error when email exists", async () => {
      // Arrange
      const existingUser = {
        email: "existing@example.com",
        password: "password123",
        name: "Existing User",
      };
      mockReq.body = existingUser;

      const error = new Error("Email already exists");
      (authService.signup as jest.Mock).mockRejectedValue(error);

      // Act
      await authController.signup(mockReq as Request, mockRes as Response);

      // Assert
      expect(authService.signup).toHaveBeenCalledWith(existingUser);
    });

    it("should handle signup with invalid data", async () => {
      // Arrange
      mockReq.body = {
        email: "invalid-email",
        password: "123",
      };

      const error = new Error("Invalid user data");
      (authService.signup as jest.Mock).mockRejectedValue(error);

      // Act
      await authController.signup(mockReq as Request, mockRes as Response);

      // Assert
      expect(authService.signup).toHaveBeenCalledWith(mockReq.body);
    });
  });
});
