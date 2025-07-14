import OperationRepository from "../repositories/operationRepository";
import { Decimal } from "@prisma/client/runtime/library";

enum OperationType {
  INCOME = 1,
  EXPENSE = 2,
}

interface BalanceResult {
  totalIncomes: Decimal;
  totalExpenses: Decimal;
  currentBalance: Decimal;
}

class BalanceService {
  constructor(private operationRepository: OperationRepository) {}

  async getBalance(userId: number): Promise<BalanceResult> {
    const [totalIncomes, totalExpenses] = await Promise.all([
      this.operationRepository.sumAmount({
        userId,
        typeId: OperationType.INCOME,
      }),
      this.operationRepository.sumAmount({
        userId,
        typeId: OperationType.EXPENSE,
      }),
    ]);

    const currentBalance = new Decimal(totalIncomes).minus(
      new Decimal(totalExpenses)
    );

    return {
      totalIncomes,
      totalExpenses,
      currentBalance,
    };
  }
}

export default BalanceService;
