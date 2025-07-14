import { Request, Response } from "express";
import AuthService from "../services/authService";
import { ResponseController } from "../../helpers/responseController";
import { IAuthController } from "../interfaces/IAuthController";

class AuthController extends ResponseController implements IAuthController {
  constructor(private readonly authService: AuthService) {
    super();
    this.login = this.login.bind(this);
    this.signup = this.signup.bind(this);
  }

  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);
      console.log(result);
      this.sendSuccess(res, result, "Login successful");
    } catch (error) {
      this.sendError(res, error);
    }
  }

  public async signup(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.authService.signup(req.body);
      this.sendCreated(res, result, "User registered successfully");
    } catch (error) {
      this.sendError(res, error);
    }
  }
}

export default AuthController;
