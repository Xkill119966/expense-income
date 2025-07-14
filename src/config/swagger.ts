// src/config/swagger.ts
import { SwaggerDefinition } from "swagger-jsdoc";

const swaggerDefinition: SwaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "myBudget API",
    description: "A personal budget management REST API",
    contact: {
      email: "niicolas.caro@gmail.com",
    },
    version: "1.0.0",
  },
  externalDocs: {
    description: "Github Repository",
    url: "https://github.com/n-caro/mybudget-backend",
  },
  servers: [
    {
      url: "/api",
      description: "Main API server",
    },
  ],
  components: {
    securitySchemes: {
      Token: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      Operation: {
        type: "object",
        properties: {
          amount: {
            type: "number",
            minimum: 0,
            example: 150.75,
          },
          dateOperation: {
            type: "string",
            format: "date",
            example: "2023-05-20",
          },
          note: {
            type: "string",
            example: "Grocery shopping",
            nullable: true,
          },
          categoryId: {
            type: "integer",
            example: 3,
          },
          typeId: {
            type: "integer",
            example: 2,
            description: "1=Income, 2=Expense",
          },
        },
        required: ["amount", "dateOperation", "categoryId", "typeId"],
      },
      OperationUpdate: {
        type: "object",
        properties: {
          amount: {
            type: "number",
            minimum: 0,
            example: 200.5,
          },
          dateOperation: {
            type: "string",
            format: "date",
            example: "2023-05-21",
          },
          note: {
            type: "string",
            example: "Updated grocery shopping",
            nullable: true,
          },
          categoryId: {
            type: "integer",
            example: 4,
          },
        },
      },
      UserCreate: {
        type: "object",
        properties: {
          name: {
            type: "string",
            example: "John Doe",
          },
          email: {
            type: "string",
            format: "email",
            example: "john@example.com",
          },
          password: {
            type: "string",
            example: "securePassword123",
            minLength: 6,
          },
        },
        required: ["name", "email", "password"],
      },
      UserLogin: {
        type: "object",
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "john@example.com",
          },
          password: {
            type: "string",
            example: "securePassword123",
          },
        },
        required: ["email", "password"],
      },
      BalanceResponse: {
        type: "object",
        properties: {
          totalIncomes: {
            type: "number",
            example: 2500.75,
          },
          totalExpenses: {
            type: "number",
            example: 1500.25,
          },
          currentBalance: {
            type: "number",
            example: 1000.5,
          },
        },
      },
      Category: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            example: 1,
          },
          name: {
            type: "string",
            example: "Groceries",
          },
          typeId: {
            type: "integer",
            example: 2,
            description: "1=Income, 2=Expense",
          },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: false,
          },
          message: {
            type: "string",
            example: "Error message",
          },
          status: {
            type: "integer",
            example: 400,
          },
        },
      },
    },
  },
  tags: [
    {
      name: "auth",
      description: "Authentication endpoints",
    },
    {
      name: "balance",
      description: "Financial balance tracking",
    },
    {
      name: "categories",
      description: "Operation categories management",
    },
    {
      name: "operations",
      description: "Financial operations management",
    },
  ],
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts", "./src/dtos/*.ts"],
};

export default options;
