import express, { Application, NextFunction, Request, Response } from "express";
import cors, { CorsOptions } from "cors";
import httpStatus from "http-status";
import APIError from "./helpers/apiError";
import Routes from "./routes";
import { rateLimiter } from "./middleware/rateLimiter";
import { env } from "./config/envConfig";
class App {
  private app: Application;

  constructor() {
    this.app = express();
    this.setup();
  }

  private setup(): void {
    this.setupMiddlewares();
    this.setupRoutes();
    this.setupErrorHandlers();
  }

  private setupMiddlewares(): void {
    // CORS configuration
    const corsOptions: CorsOptions = {
      origin: process.env.CORS_ORIGIN || "*",
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    };

    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(rateLimiter);
  }

  private setupRoutes(): void {
    new Routes(this.app);
  }

  private setupErrorHandlers(): void {
    this.app.use(this.errorHandler.bind(this));
    this.app.use(this.catchHandler.bind(this));
  }

  private errorHandler(
    err: any,
    _req: Request,
    _res: Response,
    next: NextFunction
  ): void {
    if (!(err instanceof APIError)) {
      const apiError = new APIError(
        err.message || "Internal Server Error",
        err.status || httpStatus.INTERNAL_SERVER_ERROR,
        true,
        {
          stack: env.NODE_ENV === "development" ? err.stack : undefined,
        }
      );
      return next(apiError);
    }

    next(err);
  }

  private catchHandler(
    err: APIError,
    _req: Request,
    res: Response,
    _next: NextFunction
  ): void {
    res.status(err.status).json({
      status: "error",
      errorCode: err.errorCode || err.status,
      message: err.message || "Internal Server Error",
      errors: err.errors || undefined,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
  }

  public start(port: number): void {
    this.app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
    });
  }
}

export default App;
