import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import ApiError from "../helpers/apiError";
import httpStatus from "http-status";

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw new ApiError("No token provided", httpStatus.UNAUTHORIZED, true);
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret"
    ) as User;

    req.user = decoded;
    next();
  } catch (error) {
    next(new ApiError("Invalid token", httpStatus.UNAUTHORIZED, true));
  }
};
