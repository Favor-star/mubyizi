import { z } from "zod";
import { DocumentType } from "../lib/generated/prisma/enums.js";

// ── SKILLS ────────────────────────────────────────────────────

export const userSkillSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string().min(1, "Skill name is required"),
  category: z.string().nullable(),
  proficiency: z.string().nullable(),
  yearsExp: z.number().nonnegative().nullable(),
  notes: z.string().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime()
});

export const createSkillSchema = userSkillSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true
});

export const updateSkillSchema = createSkillSchema.partial();

export const skillParamsSchema = z.object({
  skillId: z.string().min(1, "Skill ID is required")
});

// ── DOCUMENTS ─────────────────────────────────────────────────

export const userDocumentSchema = z.object({
  id: z.string(),
  userId: z.string(),
  documentType: z.enum(DocumentType),
  title: z.string().min(1, "Document title is required"),
  fileUrl: z.string().url(),
  publicId: z.string().nullable(),
  expiresAt: z.iso.datetime().nullable(),
  notes: z.string().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime()
});

export const uploadDocumentSchema = z.object({
  documentType: z.enum(DocumentType),
  title: z.string().min(1, "Document title is required"),
  expiresAt: z.iso.datetime().optional(),
  notes: z.string().optional(),
  file: z.file()
});

export const docParamsSchema = z.object({
  docId: z.string().min(1, "Document ID is required")
});

// ── EMERGENCY CONTACTS ────────────────────────────────────────

export const emergencyContactSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string().min(1, "Contact name is required"),
  relationship: z.string().min(1, "Relationship is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  email: z.email().nullable(),
  isPrimary: z.boolean().default(false),
  notes: z.string().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime()
});

export const createContactSchema = emergencyContactSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true
});

export const updateContactSchema = createContactSchema.partial();

export const contactParamsSchema = z.object({
  contactId: z.string().min(1, "Contact ID is required")
});
