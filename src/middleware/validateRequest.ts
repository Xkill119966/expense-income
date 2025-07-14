import { Request, Response, NextFunction } from "express";
import ApiError from "../helpers/apiError";
import httpStatus from "http-status";
import { ZodError, ZodSchema } from "zod";

export const validateRequest = (schema: ZodSchema) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
          code: issue.code,
        }));

        next(
          new ApiError(
            "Validation error",
            httpStatus.INTERNAL_SERVER_ERROR,
            true,
            { errors: formattedErrors }
          )
        );
      } else {
        return next(error);
      }
    }
  };
};
