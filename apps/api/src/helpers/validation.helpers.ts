import { validator } from "hono-openapi";
import type { ValidationTargets } from "hono";
import type { z } from "zod";
import type { ValidationErrorProps } from "@/src/_types/index.js";

const formatValidationErrors = (error: ValidationErrorProps[]) => {
  return error.map(({ path, message }) => {
    const field = path.join(".");
    return `${field} - ${message}`;
  });
};

export const customValidator = <Target extends keyof ValidationTargets, Schema extends z.ZodSchema>(
  target: Target,
  schema: Schema
) => {
  return validator(target, schema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          data: null,
          message: "Invalid request body",
          success: false,
          error: formatValidationErrors(result.error as unknown as ValidationErrorProps[])
        },
        400
      );
    }
  });
};
