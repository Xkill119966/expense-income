import { Request, Response } from "express";
import { Decimal } from "@prisma/client/runtime/library";

import BalanceService from "../services/balanceService";
import { ResponseController } from "../../helpers/responseController";

export interface BalanceResult {
  totalIncomes: Decimal;
  totalExpenses: Decimal;
  currentBalance: Decimal;
}
class BalanceController extends ResponseController {
  constructor(private readonly balanceService: BalanceService) {
    super();
    this.getBalance = this.getBalance.bind(this);
  }

  public async getBalance(req: Request, res: Response) {
    try {
      const userId = Number(req.user.id);
      const balance: BalanceResult = await this.balanceService.getBalance(
        userId
      );
      this.sendJson(res, { balance });
    } catch (error: unknown) {
      this.sendError(res, error);
    }
  }
}

export default BalanceController;
