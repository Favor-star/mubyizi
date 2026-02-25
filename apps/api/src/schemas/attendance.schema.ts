import { z } from "zod";
import { ApprovalStatus, AttendanceStatus } from "../lib/generated/prisma/enums.js";
import { paginationQuerySchema } from "./pagination.schema.js";

export const attendanceSchema = z.object({
  id: z.string(),
  userId: z.string(),
  workplaceId: z.string().nullable(),
  date: z.iso.datetime(),
  status: z.enum(AttendanceStatus).default(AttendanceStatus.NOT_MARKED),
  checkIn: z.iso.datetime().nullable(),
  checkOut: z.iso.datetime().nullable(),
  hoursWorked: z.number().nullable(),
  shiftLabel: z.string().nullable(),
  dailyRate: z.number().nullable(),
  amountEarned: z.number().nullable(),
  isPaid: z.boolean().default(false),
  paidAt: z.iso.datetime().nullable(),
  paymentId: z.string().nullable(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  photoUrl: z.string().nullable(),
  notes: z.string().nullable(),
  approvedBy: z.string().nullable(),
  approvedAt: z.iso.datetime().nullable(),
  approvalStatus: z.enum(ApprovalStatus).default(ApprovalStatus.PENDING),
  rejectionReason: z.string().nullable(),
  rejectedBy: z.string().nullable(),
  rejectedAt: z.iso.datetime().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime()
});

export const markAttendanceSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  workplaceId: z.string().min(1, "Workplace ID is required"),
  date: z.iso.datetime(),
  status: z.enum(AttendanceStatus).default(AttendanceStatus.PRESENT),
  shiftLabel: z.string().optional(),
  dailyRate: z.number().positive().optional(),
  notes: z.string().optional()
});

export const updateAttendanceSchema = markAttendanceSchema
  .omit({ userId: true, workplaceId: true, date: true })
  .partial();

export const bulkAttendanceRecordSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  status: z.enum(AttendanceStatus).default(AttendanceStatus.PRESENT),
  shiftLabel: z.string().optional(),
  dailyRate: z.number().positive().optional(),
  notes: z.string().optional()
});

export const bulkMarkAttendanceSchema = z.object({
  workplaceId: z.string().min(1, "Workplace ID is required"),
  date: z.iso.datetime(),
  records: z.array(bulkAttendanceRecordSchema).min(1).max(200)
});

export const workplaceSheetSchema = z.object({
  date: z.iso.datetime(),
  records: z.array(bulkAttendanceRecordSchema).min(1).max(200)
});

export const clockInSchema = z.object({
  workplaceId: z.string().min(1, "Workplace ID is required"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  photoBase64: z.string().optional(),
  notes: z.string().optional()
});

export const clockOutSchema = z.object({
  workplaceId: z.string().min(1, "Workplace ID is required"),
  latitude: z.number().optional(),
  longitude: z.number().optional()
});

export const rejectAttendanceSchema = z.object({
  rejectionReason: z.string().min(1, "Rejection reason is required")
});

export const generateQrSchema = z.object({
  workplaceId: z.string().min(1, "Workplace ID is required"),
  date: z.string().optional() // YYYY-MM-DD format
});

export const scanQrSchema = z.object({
  token: z.string().min(1, "QR token is required"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  photoBase64: z.string().optional()
});

export const attendanceQuerySchema = paginationQuerySchema.extend({
  workplaceId: z.string().optional(),
  userId: z.string().optional(),
  status: z.enum(AttendanceStatus).optional(),
  approvalStatus: z.enum(ApprovalStatus).optional(),
  dateFrom: z.iso.datetime().optional(),
  dateTo: z.iso.datetime().optional(),
  isPaid: z
    .string()
    .optional()
    .transform((v) => (v === "true" ? true : v === "false" ? false : undefined))
});

export const attendanceParamsSchema = z.object({
  id: z.string().min(1, "Attendance ID is required")
});

export const exportQuerySchema = z.object({
  workplaceId: z.string().optional(),
  userId: z.string().optional(),
  dateFrom: z.iso.datetime().optional(),
  dateTo: z.iso.datetime().optional(),
  format: z.enum(["csv", "xlsx"]).default("csv")
});
