import { Router } from "express";
import CategoryController from "../controllers/categoryController";
import CategoryService from "../services/categoryService";
import CategoryRepository from "../repositories/categoryRepository";

class CategoryRoutes {
  public router: Router;
  private categoryController: CategoryController;

  constructor() {
    this.router = Router();
    const categoryRepository = new CategoryRepository();
    const categoryService = new CategoryService(categoryRepository);
    this.categoryController = new CategoryController(categoryService);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // GET all categories
    this.router.get("/", this.categoryController.getAll);
  }

  public getRouter(): Router {
    return this.router;
  }
}

export default new CategoryRoutes().getRouter();
