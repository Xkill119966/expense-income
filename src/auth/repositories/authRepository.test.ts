import { prisma } from "../../lib/prisma";
import AuthRepository from "./authRepository";
import { User } from "@prisma/client";

// Mock the Prisma client
jest.mock("../../lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe("AuthRepository", () => {
  let authRepository: AuthRepository;
  const mockUser: User = {
    id: 1,
    email: "test@example.com",
    password: "hashedPassword",
    name: "Test User",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    authRepository = new AuthRepository();
    jest.clearAllMocks();
  });

  describe("findByEmail", () => {
    it("should return a user by email", async () => {
      // Arrange
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      // Act
      const result = await authRepository.findByEmail("test@example.com");

      // Assert
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      });
      expect(result).toEqual(mockUser);
    });

    it("should return null when user not found", async () => {
      // Arrange
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      // Act
      const result = await authRepository.findByEmail(
        "nonexistent@example.com"
      );

      // Assert
      expect(result).toBeNull();
    });
  });

  describe("findById", () => {
    it("should return a user by id", async () => {
      // Arrange
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      // Act
      const result = await authRepository.findById(1);

      // Assert
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe("create", () => {
    it("should create a new user", async () => {
      // Arrange
      const newUser = {
        email: "new@example.com",
        password: "password",
        name: "New",
      };
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

      // Act
      const result = await authRepository.create(newUser);

      // Assert
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: newUser,
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe("update", () => {
    it("should update a user", async () => {
      // Arrange
      const updateData = {
        name: "Updated",
      };
      (prisma.user.update as jest.Mock).mockResolvedValue({
        ...mockUser,
        ...updateData,
      });

      // Act
      const result = await authRepository.update(1, updateData);

      // Assert
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateData,
      });
      expect(result.name).toBe("Updated");
    });
  });

  describe("error handling", () => {
    it("should throw error when database operation fails", async () => {
      // Arrange
      const error = new Error("Database error");
      (prisma.user.findUnique as jest.Mock).mockRejectedValue(error);

      // Act & Assert
      await expect(
        authRepository.findByEmail("test@example.com")
      ).rejects.toThrow("Database error");
    });
  });
});
