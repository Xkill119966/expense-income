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
    /**
     * @swagger
     * /api/operations:
     *   post:
     *     summary: Create a new operation
     *     tags: [Operation]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - amount
     *               - dateOperation
     *               - categoryId
     *               - typeId
     *             properties:
     *               amount:
     *                 type: number
     *                 example: 100
     *               dateOperation:
     *                 type: string
     *                 format: date-time
     *                 example: 2025-07-11T00:00:00.000Z
     *               note:
     *                 type: string
     *                 example: Optional note about the transaction
     *               categoryId:
     *                 type: integer
     *                 example: 1
     *               typeId:
     *                 type: integer
     *                 example: 2
     *     responses:
     *       201:
     *         description: Operation created successfully
     */

    this.router.post(
      "/",
      validateRequest(createOperationSchema),
      this.operationController.createOperation
    );

    // Get all operations (with optional query filters)
    /**
     * @swagger
     * /api/operations:
     *   get:
     *     summary: Get all operations
     *     tags: [Operation]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: List of operations
     */

    this.router.get(
      "/",
      validateRequest(getOperationsSchema),
      this.operationController.getAll
    );

    // Get operations by type
    /**
     * @swagger
     * /api/operations/type/{typeId}:
     *   get:
     *     summary: Get operations by type ID
     *     tags: [Operation]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: typeId
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Filtered operations by type
     */

    this.router.get(
      "/type/:typeId",
      validateRequest(getOperationsByTypeSchema),
      this.operationController.getAllByOperationType
    );

    // Get single operation
    /**
     * @swagger
     * /api/operations/{id}:
     *   get:
     *     summary: Get a single operation by ID
     *     tags: [Operation]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Operation details
     */

    this.router.get(
      "/:id",
      validateRequest(getOperationByIdSchema),
      this.operationController.getById
    );

    // Update operation (using PATCH as per your requirement)
    /**
     * @swagger
     * /api/operations/{id}:
     *   patch:
     *     summary: Update an existing operation
     *     tags: [Operation]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               amount:
     *                 type: number
     *                 example: 100.5
     *               dateOperation:
     *                 type: string
     *                 format: date-time
     *                 example: 2025-07-11T00:00:00.000Z
     *               note:
     *                 type: string
     *                 example: Optional note about the transaction
     *               categoryId:
     *                 type: integer
     *                 example: 7
     *               typeId:
     *                 type: integer
     *                 example: 2
     *     responses:
     *       200:
     *         description: Operation updated successfully
     */

    this.router.patch(
      "/:id",
      validateRequest(updateOperationSchema),
      this.operationController.updateOperation
    );

    // Delete operation
    /**
     * @swagger
     * /api/operations/{id}:
     *   delete:
     *     summary: Delete an operation by ID
     *     tags: [Operation]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: Operation ID to delete
     *     responses:
     *       200:
     *         description: Operation deleted successfully
     *       404:
     *         description: Operation not found
     */

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
