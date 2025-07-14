import { Response } from "express";
import httpStatus from "http-status";

interface ApiResponse<T> extends Record<string, unknown> {
  success: boolean;
  message?: string;
  error?: string | Record<string, unknown>;
  // Removed the explicit data property
}

export const sendResponse = <T>(
  res: Response,
  {
    statusCode = httpStatus.OK,
    success = true,
    message,
    data,
    error,
    ...rest // Capture any additional properties
  }: {
    statusCode?: number;
    success?: boolean;
    message?: string;
    data?: T;
    error?: string | Record<string, unknown>;
  } & Record<string, unknown> // Allow additional properties
) => {
  const response: ApiResponse<T> = {
    success,
    ...(message && { message }),
    ...(error && { error }),
    ...(data && typeof data === "object" && !Array.isArray(data)
      ? data
      : { data }), // Spread data if it's an object
    ...rest, // Include any additional properties
  };

  return res.status(statusCode).json(response);
};

export const responseSuccess = <T>(
  res: Response,
  message = "Success",
  payload?: T
) => {
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    message,
    ...(payload as Record<string, unknown>), // Spread payload directly
  });
};

export const responseCreated = <T>(
  res: Response,
  payload?: T,
  message = "Resource created successfully"
) => {
  return sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message,
    ...(payload as Record<string, unknown>), // Spread payload directly
  });
};

export const responseNoContent = (res: Response) => {
  return res.status(httpStatus.NO_CONTENT).send();
};

export const responseNotFound = (
  res: Response,
  message = "Resource not found"
) => {
  return sendResponse(res, {
    statusCode: httpStatus.NOT_FOUND,
    success: false,
    message,
    error: {
      code: "NOT_FOUND",
      details: "The requested resource was not found",
    },
  });
};

export const responseError = (
  res: Response,
  {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR,
    message = "Internal Server Error",
    error = "Internal Server Error",
    errorCode = "INTERNAL_ERROR",
    errorDetails = undefined,
  }: {
    statusCode?: number;
    message?: string;
    error?: string | Record<string, unknown>;
    errorCode?: string;
    errorDetails?: any;
  }
) => {
  const errorResponse =
    typeof error === "string"
      ? { code: errorCode, message: error, details: errorDetails }
      : error;

  return sendResponse(res, {
    statusCode,
    success: false,
    message,
    error: errorResponse,
  });
};
