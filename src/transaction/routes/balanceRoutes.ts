import { Router } from "express";
import BalanceController from "../controllers/balanceController";
import BalanceService from "../services/balanceService";
import OperationRepository from "../repositories/operationRepository";

class BalanceRoutes {
  public router: Router;
  private balanceController: BalanceController;

  constructor() {
    this.router = Router();
    const operationRepository = new OperationRepository();
    const balanceService = new BalanceService(operationRepository);
    this.balanceController = new BalanceController(balanceService);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    /**
     * @swagger
     * /api/balance:
     *   get:
     *     summary: Get current balance
     *     tags: [Balance]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Balance fetched successfully
     */

    this.router.get("/", this.balanceController.getBalance);
  }

  public getRouter(): Router {
    return this.router;
  }
}

export default new BalanceRoutes().getRouter();
