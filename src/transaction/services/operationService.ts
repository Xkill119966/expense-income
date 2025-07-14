import OperationRepository from "../repositories/operationRepository";
import CategoryRepository from "../repositories/categoryRepository";
import ErrorResponse from "../../helpers/apiError";

class OperationService {
  constructor(
    private operationRepository: OperationRepository,
    private categoryRepository: CategoryRepository
  ) {}

  async createOperation(operation: any): Promise<any> {
    return this.operationRepository.createOperation(operation);
  }

  async getAll(userId: number, pagination: any): Promise<any> {
    const query = { userId };
    const [total, operations] = await Promise.all([
      this.operationRepository.countOperations(query),
      this.operationRepository.getAll(query, pagination),
    ]);

    return {
      data: operations,
      meta: {
        currentPage: pagination.page,
        perPage: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
      },
    };
  }

  async getAllByOperationType(
    typeId: number,
    userId: number,
    pagination: any
  ): Promise<any> {
    const query = { userId, typeId };
    const { limit, page } = pagination;
    const [total, operations] = await Promise.all([
      this.operationRepository.countOperations(query),
      this.operationRepository.getAll(query, { limit, page }),
    ]);

    return {
      data: operations,
      meta: {
        currentPage: page,
        perPage: limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id: number, userId: number): Promise<any> {
    const operation = await this.operationRepository.getById(id, userId);
    if (!operation) {
      throw new ErrorResponse("Operation not found", 404);
    }
    return operation;
  }

  async deleteOperation(id: number, userId: number): Promise<void> {
    const deleteResult = await this.operationRepository.deleteById(id, userId);
    if (deleteResult.count === 0) {
      throw new ErrorResponse("Operation not found", 404);
    }
  }

  async updateOperation(
    id: number,
    userId: number,
    updateValues: any
  ): Promise<any> {
    // Verify operation exists
    const operation = await this.getById(id, userId);
    if (!operation) {
      throw new ErrorResponse("Operation not found", 404);
    }
    console.log(operation);
    // Validate category if being updated
    if (updateValues.categoryId) {
      const category = await this.categoryRepository.getById(
        updateValues.categoryId
      );

      if (!category || category.typeId !== operation.typeId) {
        throw new ErrorResponse(
          "Invalid category for this operation type",
          400
        );
      }
    }

    // Perform update
    const updateResult = await this.operationRepository.update(
      id,
      userId,
      updateValues
    );
    if (updateResult.count === 0) {
      throw new ErrorResponse("Operation could not be updated", 500);
    }

    // Return updated operation
    return this.operationRepository.getById(id, userId);
  }
}

export default OperationService;
