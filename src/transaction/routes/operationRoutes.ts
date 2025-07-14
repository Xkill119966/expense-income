import { Router } from "express";
import OperationController from "../controllers/operationController";
import OperationService from "../services/operationService";
import OperationRepository from "../repositories/operationRepository";
import { validateRequest } from "../../middleware/validateRequest";
import {
  createOperationSchema,
  updateOperationSchema,
  getOperationsSchema,
  getOperationByIdSchema,
  deleteOperationSchema,
  getOperationsByTypeSchema,
} from "../validations/operationValidation";
import CategoryRepository from "../repositories/categoryRepository";

class OperationRoutes {
  public router: Router;
  private operationController: OperationController;

  constructor() {
    this.router = Router();
    const operationRepository = new OperationRepository();
    const categoryRepository = new CategoryRepository(); // Assuming you have a category repository
    const operationService = new OperationService(
      operationRepository,
      categoryRepository
    );
    this.operationController = new OperationController(operationService);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.post(
      "/",
      validateRequest(createOperationSchema),
      this.operationController.createOperation
    );

    // Get all operations (with optional query filters)
    this.router.get(
      "/",
      validateRequest(getOperationsSchema),
      this.operationController.getAll
    );

    // Get operations by type
    this.router.get(
      "/type/:typeId",
      validateRequest(getOperationsByTypeSchema),
      this.operationController.getAllByOperationType
    );

    // Get single operation
    this.router.get(
      "/:id",
      validateRequest(getOperationByIdSchema),
      this.operationController.getById
    );

    // Update operation (using PATCH as per your requirement)
    this.router.patch(
      "/:id",
      validateRequest(updateOperationSchema),
      this.operationController.updateOperation
    );

    // Delete operation
    this.router.delete(
      "/:id",
      validateRequest(deleteOperationSchema),
      this.operationController.deleteOperation
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}

export default new OperationRoutes().getRouter();
