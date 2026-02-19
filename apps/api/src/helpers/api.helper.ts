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
  if (error instanceof APIError) throw error;
  if (error instanceof APIError) throw error;
  if (error instanceof Prisma.PrismaClientKnownRequestError || error instanceof Prisma.PrismaClientValidationError)
    throw error;

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
