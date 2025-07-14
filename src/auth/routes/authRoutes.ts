import { Router } from "express";
import AuthController from "../controllers/authController";
import AuthService from "../services/authService";
import { loginSchema, registerSchema } from "../validations/authValidation";
import { validateRequest } from "../../middleware/validateRequest";
import AuthRepository from "../repositories/authRepository";

class AuthRoutes {
  public router: Router;
  private authController: AuthController;

  constructor() {
    this.router = Router();
    const authRepository = new AuthRepository();
    const authService = new AuthService(authRepository);
    this.authController = new AuthController(authService);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.post(
      "/signin",
      validateRequest(loginSchema),
      this.authController.login
    );
    this.router.post(
      "/signup",
      validateRequest(registerSchema),
      this.authController.signup
    );
  }
  public getRouter(): Router {
    return this.router;
  }
}

export default new AuthRoutes().getRouter();
