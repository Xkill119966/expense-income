import { User } from "@prisma/client";
import { CreateUserDto, UpdateUserDto } from "../types/users";

export interface IAuthRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
  create(data: CreateUserDto): Promise<User>;
  update(id: number, data: UpdateUserDto): Promise<User>;
}
