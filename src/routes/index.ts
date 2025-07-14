import { Application, Request, Response } from "express";
import AuthRoutes from "../auth/routes/authRoutes";
import BalanceRoutes from "../transaction/routes/balanceRoutes";
import OperationRoutes from "../transaction/routes/operationRoutes";
import CategoryRoutes from "../transaction/routes/categoryRoutes";
import swagger from "../config/swagger";
import { authenticate } from "../middleware/authMiddleware";
import swaggerUi from "swagger-ui-express";

class Routes {
  constructor(app: Application) {
    app.use("/api/auth", AuthRoutes);
    app.use("/api/balance", authenticate, BalanceRoutes);
    app.use("/api/operations", authenticate, OperationRoutes);
    app.use("/api/categories", authenticate, CategoryRoutes);

    app.get("/health", (_req: Request, res: Response) => {
      res.json({
        test: "Ok",
      });
    });

    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swagger));
  }
}

export default Routes;
