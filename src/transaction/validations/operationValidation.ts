import { z } from "zod";

export const createOperationSchema = z.object({
  body: z.object({
    amount: z.number().positive("Amount must be positive"),
    dateOperation: z.coerce.date({
      required_error: "Operation date is required",
      invalid_type_error: "Invalid date format",
    }),
    note: z.string().max(500, "Note too long (max 500 chars)").optional(),
    categoryId: z.number().int("Category ID must be an integer"),
    typeId: z.number().int("Type ID must be an integer"),
  }),
});

export const updateOperationSchema = z.object({
  body: z.object({
    amount: z.number().positive("Amount must be positive").optional(),
    dateOperation: z.coerce
      .date({
        invalid_type_error: "Invalid date format",
      })
      .optional(),
    note: z.string().max(500, "Note too long (max 500 chars)").optional(),
    categoryId: z.number().int("Category ID must be an integer").optional(),
  }),
  params: z.object({
    id: z.string().regex(/^\d+$/, "Operation ID must be numeric"),
  }),
});

export const getOperationsSchema = z.object({
  query: z.object({
    limit: z.string().regex(/^\d+$/, "Limit must be numeric").optional(),
    page: z.string().regex(/^\d+$/, "Page must be numeric").optional(),
    typeId: z.string().regex(/^\d+$/, "Type ID must be numeric").optional(),
    categoryId: z
      .string()
      .regex(/^\d+$/, "Category ID must be numeric")
      .optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
  }),
});

export const getOperationByIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "Operation ID must be numeric"),
  }),
});

export const deleteOperationSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "Operation ID must be numeric"),
  }),
});

export const getOperationsByTypeSchema = z.object({
  params: z.object({
    typeId: z
      .string({
        required_error: "Type ID is required",
        invalid_type_error: "Type ID must be a string",
      })
      .regex(/^\d+$/, {
        message: "Type ID must be a numeric string",
      }),
  }),
  query: z
    .object({
      limit: z.string().regex(/^\d+$/, "Limit must be a number").optional(),
      page: z.string().regex(/^\d+$/, "Page must be a number").optional(),
      startDate: z.string().datetime({ offset: true }).optional(),
      endDate: z.string().datetime({ offset: true }).optional(),
    })
    .refine(
      (data) => {
        if (data.startDate && data.endDate) {
          return new Date(data.startDate) < new Date(data.endDate);
        }
        return true;
      },
      {
        message: "Start date must be before end date",
        path: ["startDate"],
      }
    ),
});
