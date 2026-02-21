import { APIError } from "better-auth";
import { HTTPException } from "hono/http-exception";
import { type ContentfulStatusCode } from "hono/utils/http-status";
import { Prisma } from "../lib/generated/prisma/client.js";

export const apiSuccessResponse = <T>(data: T, message: string) => ({
  data,
  error: null,
  message,
  success: true
});
export const apiErrorResponse = <T>(error: T, message: string) => ({
  data: null,
  error,
  message,
  success: false
});

export const handleAPiError = <T>(error: T, message = "An error occurred", status = 500): never => {
  if (error instanceof APIError)
    throw new HTTPException(error.statusCode as ContentfulStatusCode, {
      cause: error,
      message: error.message || message
    });

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle specific Prisma error codes
    if (error.code === "P2025") {
      // Record not found
      throw new HTTPException(404, {
        cause: error,
        message: "Record not found"
      });
    }
    if (error.code === "P2002") {
      // Unique constraint violation
      throw new HTTPException(409, {
        cause: error,
        message: "A record with this value already exists"
      });
    }
    if (error.code === "P2003") {
      // Foreign key constraint failed
      throw new HTTPException(400, {
        cause: error,
        message: "Invalid reference to related record"
      });
    }
    // Other Prisma errors
    throw new HTTPException(400, {
      cause: error,
      message: error.message || message
    });
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    throw new HTTPException(400, {
      cause: error,
      message: "Invalid data provided"
    });
  }

  if (error instanceof HTTPException) {
    throw new HTTPException(error.status ?? (status as ContentfulStatusCode), {
      cause: error,
      message: error.message || message
    });
  }
  throw new HTTPException(status as ContentfulStatusCode, {
    cause: error,
    message
  });
};
