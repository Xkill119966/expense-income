import CategoryRepository from "../repositories/categoryRepository";

class CategoryService {
  private readonly categoryRepository: CategoryRepository;

  constructor(categoryRepository: CategoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async getAll() {
    return await this.categoryRepository.getAll();
  }
}

export default CategoryService;
