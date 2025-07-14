import { Response } from "express";
import {
  responseSuccess,
  responseCreated,
  responseError,
  responseNotFound,
  responseNoContent,
} from "../utils/responseHandler";
import httpStatus from "http-status";

export class ResponseController {
  public sendSuccess(res: Response, data: any, message?: string): void {
    console.log("Data", data);
    responseSuccess(res, message, data);
  }

  public sendCreated(res: Response, data: any, message?: string): void {
    responseCreated(res, data, message);
  }

  public sendError(
    res: Response,
    error: any,
    status: any = httpStatus.INTERNAL_SERVER_ERROR
  ): void {
    responseError(res, {
      statusCode: error.status || status,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }

  public sendNotFound(res: Response): void {
    responseNotFound(res);
  }

  public sendNoContent(res: Response): void {
    responseNoContent(res);
  }

  public sendJson(res: Response, data: any) {
    return res.json(data);
  }
}
