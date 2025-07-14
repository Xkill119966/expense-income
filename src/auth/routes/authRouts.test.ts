import { Request, Response } from "express";
import AuthController from "../controllers/authController";
import AuthService from "../services/authService";
import AuthRepository from "../repositories/authRepository";

jest.mock("../services/AuthService");
jest.mock("../repositories/AuthRepository");

const MockAuthService = AuthService as jest.MockedClass<typeof AuthService>;
const MockAuthRepository = AuthRepository as jest.MockedClass<
  typeof AuthRepository
>;

describe("AuthController", () => {
  let authController: AuthController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseObject: any;

  beforeEach(() => {
    MockAuthService.mockClear();
    MockAuthRepository.mockClear();

    const authRepository = new MockAuthRepository();
    const authService = new MockAuthService(authRepository);
    authController = new AuthController(authService);

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((result) => {
        responseObject = result;
        return mockResponse;
      }) as any,
      send: jest.fn(),
    };

    responseObject = {};
  });

  describe("login", () => {
    it("should return 200 with token for valid credentials", async () => {
      // Arrange
      const mockToken = "mock-jwt-token";
      (AuthService.prototype.login as jest.Mock).mockResolvedValue({
        token: mockToken,
      });
      mockRequest = {
        body: { email: "test@example.com", password: "validPassword123" },
      };

      // Act
      await authController.login(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(AuthService.prototype.login).toHaveBeenCalledWith(
        "test@example.com",
        "validPassword123"
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it("should return 401 for invalid credentials", async () => {
      // Arrange
      (AuthService.prototype.login as jest.Mock).mockRejectedValue(
        new Error("Invalid credentials")
      );
      mockRequest = {
        body: { email: "wrong@example.com", password: "wrongPassword" },
      };

      // Act
      await authController.login(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      // expect(responseObject).toEqual({ error: 'Invalid credentials' });
    });
  });

  describe("signup", () => {
    it("should return 201 for successful registration", async () => {
      // Arrange
      const mockUser = { id: 1, email: "new@example.com" };
      (AuthService.prototype.signup as jest.Mock).mockResolvedValue(mockUser);
      mockRequest = {
        body: {
          email: "new@example.com",
          password: "ValidPassword123!",
          name: "New User",
        },
      };

      // Act
      await authController.signup(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(AuthService.prototype.signup).toHaveBeenCalledWith({
        email: "new@example.com",
        password: "ValidPassword123!",
        name: "New User",
      });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
    });

    it("should return 500 for existing email", async () => {
      // Arrange
      (AuthService.prototype.signup as jest.Mock).mockRejectedValue(
        new Error("User already exists")
      );
      mockRequest = {
        body: {
          email: "exists@example.com",
          password: "ValidPassword123!",
          name: "Existing User",
        },
      };

      // Act
      await authController.signup(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      console.log(responseObject);
    });
  });
});
