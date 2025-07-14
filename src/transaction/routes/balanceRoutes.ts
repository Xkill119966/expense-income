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
    // In your balanceRoutes.ts
    /**
     * @swagger
     * tags:
     *   name: Balance
     *   description: Financial balance tracking
     */

    /**
     * @swagger
     * /balance:
     *   get:
     *     tags: [Balance]
     *     summary: Get current financial balance
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Current balance information
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Balance'
     *       401:
     *         description: Unauthorized
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    this.router.get("/", this.balanceController.getBalance);
  }

  public getRouter(): Router {
    return this.router;
  }
}

export default new BalanceRoutes().getRouter();
