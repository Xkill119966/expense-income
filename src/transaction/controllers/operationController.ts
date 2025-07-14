import { Request, Response } from "express";

import OperationService from "../services/operationService";
import { ResponseController } from "../../helpers/responseController";

class OperationController extends ResponseController {
  private readonly operationService: OperationService;

  constructor(operationService: OperationService) {
    super();
    this.operationService = operationService;
    this.createOperation = this.createOperation.bind(this);
    this.getAll = this.getAll.bind(this);
    this.getAllByOperationType = this.getAllByOperationType.bind(this);
    this.getById = this.getById.bind(this);
    this.updateOperation = this.updateOperation.bind(this);
    this.deleteOperation = this.deleteOperation.bind(this);
  }

  async createOperation(req: Request, res: Response) {
    try {
      const operationData: any = {
        amount: parseFloat(req.body.amount),
        dateOperation: new Date(req.body.dateOperation),
        note: req.body.note,
        categoryId: parseInt(req.body.categoryId),
        typeId: parseInt(req.body.typeId),
        userId: req.user.id,
      };

      const operation = await this.operationService.createOperation(
        operationData
      );

      this.sendCreated(res, operation, "Operation created successfully");
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const pagination: any = {
        limit: parseInt(req.query.limit as string) || 10,
        page: parseInt(req.query.page as string) || 1,
      };

      const operations = await this.operationService.getAll(
        req.user.id,
        pagination
      );

      const response = {
        success: true,
        message: "Operations retrieved successfully",
        data: operations,
        status: 200,
      };
      this.sendJson(res, operations);
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  async getAllByOperationType(req: Request, res: Response) {
    try {
      const pagination: any = {
        limit: parseInt(req.query.limit as string) || 10,
        page: parseInt(req.query.page as string) || 1,
      };

      const operations = await this.operationService.getAllByOperationType(
        parseInt(req.params.typeId),
        req.user.id,
        pagination
      );

      this.sendJson(res, operations);
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const operation = await this.operationService.getById(
        parseInt(req.params.id),
        req.user.id
      );
      this.sendJson(res, operation);
    } catch (error) {
      return this.sendError(res, error);
    }
  }

  async updateOperation(req: Request, res: Response) {
    try {
      const updateData = {
        ...req.body,
        id: parseInt(req.params.id),
        userId: req.user.id,
      };

      const operation = await this.operationService.updateOperation(
        updateData.id,
        updateData.userId,
        updateData
      );
      this.sendSuccess(res, operation, "Operation updated successfully");
    } catch (error) {
      this.sendError(res, error);
    }
  }

  async deleteOperation(req: Request, res: Response) {
    try {
      await this.operationService.deleteOperation(
        parseInt(req.params.id),
        req.user.id
      );

      this.sendSuccess(res, null, "Operation deleted successfully");
    } catch (error) {
      return this.sendError(res, error);
    }
  }
}

export default OperationController;
