import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

class OperationRepository {
  async createOperation(operation: any) {
    return prisma.operation.create({
      data: operation,
    });
  }
  async getAll(query: any, pagination: any) {
    const { limit, page } = pagination;
    const skip = limit * (page - 1);

    return prisma.operation.findMany({
      where: query,
      skip,
      take: limit,
      orderBy: {
        dateOperation: "desc",
      },
      select: {
        id: true,
        amount: true,
        dateOperation: true,
        note: true,
        updatedAt: true,
        type: {
          select: {
            id: true,
            type: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async countOperations(query: any) {
    return prisma.operation.count({
      where: query,
    });
  }

  async sumAmount(query: Prisma.OperationWhereInput): Promise<Prisma.Decimal> {
    const result = await prisma.operation.aggregate({
      where: query,
      _sum: {
        amount: true,
      },
    });

    return result._sum.amount || new Prisma.Decimal(0);
  }

  async getById(id: number, userId: number) {
    return prisma.operation.findFirst({
      where: {
        id,
        userId,
      },
    });
  }

  async deleteById(id: number, userId: number) {
    return prisma.operation.deleteMany({
      where: {
        id,
        userId,
      },
    });
  }

  async update(id: number, userId: number, data: any) {
    console.log(">>>", data);
    return prisma.operation.updateMany({
      where: {
        id,
        userId,
      },
      data: {
        ...data,
        dateOperation: new Date(data.dateOperation),
      },
    });
  }
}

export default OperationRepository;
