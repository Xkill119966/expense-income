import { Request, Response } from "express";
import CategoryService from "../services/categoryService";
import { ResponseController } from "../../helpers/responseController";

class CategoryController extends ResponseController {
  private readonly categoryService: CategoryService;

  constructor(categoryService: CategoryService) {
    super();
    this.categoryService = categoryService;
    this.getAll = this.getAll.bind(this); // Ensure proper `this` context
  }

  public async getAll(req: Request, res: Response) {
    try {
      const categories = await this.categoryService.getAll();
      this.sendJson(res, categories);
    } catch (error: any) {
      this.sendError(res, error, 500); // Use 500 for internal server errors
    }
  }
}

export default CategoryController;
