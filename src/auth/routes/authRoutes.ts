import { Router } from "express";
import AuthController from "../controllers/authController";
import AuthService from "../services/authService";
import { loginSchema, registerSchema } from "../validations/authValidation";
import { validateRequest } from "../../middleware/validateRequest";
import AuthRepository from "../repositories/authRepository";

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication endpoints
 */
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
    /**
     * @swagger
     * /api/auth/signin:
     *   post:
     *     summary: User login
     *     tags: [Authentication]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - password
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *                 example: rein@gmail.com
     *               password:
     *                 type: string
     *                 format: password
     *                 example: hellopassword
     *     responses:
     *       200:
     *         description: Successfully authenticated
     *       401:
     *         description: Unauthorized
     */

    /**
     * @swagger
     * /api/auth/signup:
     *   post:
     *     summary: Register a new user
     *     tags: [Authentication]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - name
     *               - email
     *               - password
     *             properties:
     *               name:
     *                 type: string
     *                 example: Hello
     *               email:
     *                 type: string
     *                 format: email
     *                 example: rein@gmail.com
     *               password:
     *                 type: string
     *                 format: password
     *                 example: hellopassword
     *     responses:
     *       201:
     *         description: User created successfully
     */

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
