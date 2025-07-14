import { prisma } from "../../lib/prisma";

class CategoryRepository {
  async getAll() {
    return await prisma.category.findMany();
  }

  async getById(id: number) {
    return await prisma.category.findUnique({
      where: { id },
    });
  }
}

export default CategoryRepository;
