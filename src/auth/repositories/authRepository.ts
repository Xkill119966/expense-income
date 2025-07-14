import { prisma } from "../../lib/prisma";
import { User } from "@prisma/client";
import { IAuthRepository } from "../interfaces/IAuthRepository";
import { CreateUserDto, UpdateUserDto } from "../types/users";

class AuthRepository implements IAuthRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: number): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async create(data: CreateUserDto): Promise<User> {
    return prisma.user.create({
      data,
    });
  }

  async update(id: number, data: UpdateUserDto): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }
}

export default AuthRepository;
