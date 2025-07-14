import { Application, Request, Response } from "express";
import AuthRoutes from "../auth/routes/authRoutes";
import BalanceRoutes from "../transaction/routes/balanceRoutes";
import OperationRoutes from "../transaction/routes/operationRoutes";
import CategoryRoutes from "../transaction/routes/categoryRoutes";
import { responseSuccess } from "../utils/responseHandler";
import { serve, setup } from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerOptions from "../config/swagger";
import { authenticate } from "../middleware/authMiddleware";
const swaggerSpec = swaggerJSDoc(swaggerOptions);
class Routes {
  constructor(app: Application) {
    app.use("/api/auth", AuthRoutes);
    app.use("/api/balance", authenticate, BalanceRoutes);
    app.use("/api/operations", authenticate, OperationRoutes);
    app.use("/api/categories", authenticate, CategoryRoutes);

    app.get("/health", (_req: Request, res: Response) => {});

    app.use("/api-docs", serve, setup(swaggerSpec));
  }
}

export default Routes;
