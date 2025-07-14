import { User } from "@prisma/client";
import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";
import { env } from "../../config/envConfig";
import { TokenPayload, ResetTokenPayload } from "../types/users";

class TokenService {
  public generateToken(user: User): string {
    const payload: TokenPayload = {
      ...user,
    };

    const options: SignOptions = {
      expiresIn: Number(env.JWT_EXPIRES_IN) || "1d",
    };

    return jwt.sign(payload, env.JWT_SECRET as string, options);
  }

  public generateResetToken(userId: number): string {
    const payload: ResetTokenPayload = {
      userId,
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
    };

    return jwt.sign(payload, env.JWT_SECRET as string);
  }

  public async verifyToken(token: string): Promise<TokenPayload & JwtPayload> {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET as string);
      return decoded as TokenPayload & JwtPayload;
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  }

  public async verifyResetToken(
    token: string
  ): Promise<ResetTokenPayload & JwtPayload> {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET as string);
      return decoded as ResetTokenPayload & JwtPayload;
    } catch (error) {
      throw new Error("Invalid or expired reset token");
    }
  }

  public decodeToken(token: string): TokenPayload & JwtPayload {
    return jwt.decode(token) as TokenPayload & JwtPayload;
  }
}

export default TokenService;
