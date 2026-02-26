import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { OrgRole, SystemRole } from "../lib/generated/prisma/enums.js";
import { type HonoInstanceContext } from "../_types/index.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { customValidator } from "../helpers/validation.helpers.js";
import { apiErrorResponse, apiSuccessResponse, handleAPiError } from "../helpers/api.helper.js";
import { buildPaginationMeta, getPagination } from "../helpers/pagination.helper.js";
import withPrisma from "../lib/prisma-client.js";
import { createUserSchema, updateUserSchema, userParamsSchema, listUsersQuerySchema } from "../schemas/user.schema.js";
import {
  createSkillSchema,
  updateSkillSchema,
  skillParamsSchema,
  uploadDocumentSchema,
  docParamsSchema,
  createContactSchema,
  updateContactSchema,
  contactParamsSchema
} from "../schemas/user-extensions.schema.js";
import { paginationQuerySchema } from "../schemas/pagination.schema.js";
import { exportQuerySchema } from "../schemas/attendance.schema.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../lib/cloudinary.js";
import {
  listUsersDocs,
  createUserDocs,
  getUserDocs,
  updateUserDocs,
  deleteUserDocs,
  getUserAttendanceDocs,
  getUserEarningsDocs,
  getUserPaymentsDocs,
  getUserWorkplacesDocs,
  getUserTimelineDocs,
  listSkillsDocs,
  createSkillDocs,
  updateSkillDocs,
  deleteSkillDocs,
  listDocumentsDocs,
  uploadDocumentDocs,
  deleteDocumentDocs,
  listContactsDocs,
  createContactDocs,
  updateContactDocs,
  deleteContactDocs,
  bulkImportUsersDocs,
  exportUsersDocs
} from "../docs/users.docs.js";

const MANAGER_ROLES: Set<OrgRole> = new Set([OrgRole.OWNER, OrgRole.ADMIN, OrgRole.MANAGER]);

// Helper: verify self or SUPERADMIN access
const assertSelfOrSuperAdmin = (currentUser: { id: string; systemRole: SystemRole }, targetId: string) =>
  currentUser.id === targetId || currentUser.systemRole === SystemRole.SUPERADMIN;

const usersRoutes = new Hono<HonoInstanceContext>()
  .use(withPrisma)
  // GET /users/export — must be before /:id
  .get(
    "/export",
    requireAuth(),
    customValidator("query", exportQuerySchema),
    describeRoute(exportUsersDocs),
    async (c) => {
      try {
        const prisma = c.get("prisma");
        const currentUser = c.get("user")!;
        const {  format } = c.req.valid("query");

        // SUPERADMIN or MANAGER in orgId
        if (currentUser.systemRole !== SystemRole.SUPERADMIN) {
          // non-superadmin must have a orgId via query
          const orgId = c.req.query("orgId");
          if (!orgId) {
            return c.json(apiErrorResponse("FORBIDDEN", "orgId query param required for non-SUPERADMIN"), 403);
          }
          const membership = await prisma.orgMembership.findFirst({
            where: { userId: currentUser.id, orgId }
          });
          if (!membership || !MANAGER_ROLES.has(membership.role)) {
            return c.json(apiErrorResponse("FORBIDDEN", "Insufficient organization privileges"), 403);
          }
        }

        const users = await prisma.users.findMany({
          omit: { wageId: true, lastLoginAt: true },
          orderBy: { createdAt: "desc" }
        });

        const rows = users.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email ?? "",
          occupation: u.occupation ?? "",
          occupationCategory: u.occupationCategory ?? "",
          skillLevel: u.skillLevel ?? "",
          systemRole: u.systemRole,
          phoneNumber: u.phoneNumber ?? "",
          createdAt: u.createdAt.toISOString()
        }));

        if (format === "xlsx") {
          const XLSX = await import("xlsx");
          const ws = XLSX.utils.json_to_sheet(rows);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, "Users");
          const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as unknown as BodyInit;
          return new Response(buffer, {
            headers: {
              "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              "Content-Disposition": `attachment; filename="users.xlsx"`
            }
          });
        }

        const firstRow = rows[0] ?? {};
        const headers = Object.keys(firstRow).join(",");
        const csvRows = rows.map((r) => Object.values(r).join(","));
        const csv = [headers, ...csvRows].join("\n");
        return new Response(csv, {
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": `attachment; filename="users.csv"`
          }
        });
      } catch (error) {
        return handleAPiError(error, "Unexpected error exporting users");
      }
    }
  )
  // POST /users/bulk-import — must be before /:id
  .post("/bulk-import", requireAuth(), describeRoute(bulkImportUsersDocs), async (c) => {
    try {
      const prisma = c.get("prisma");
      const currentUser = c.get("user")!;

      if (currentUser.systemRole !== SystemRole.SUPERADMIN) {
        return c.json(apiErrorResponse("FORBIDDEN", "Only SUPERADMIN can bulk import users"), 403);
      }

      const formData = await c.req.formData();
      const file = formData.get("file");
      const orgId = formData.get("orgId") as string | null;

      if (!file || typeof file === "string") {
        return c.json(apiErrorResponse("INVALID_FILE", "A file must be provided"), 400);
      }

      const fileName = file.name ?? "";
      const fileBuffer = Buffer.from(await file.arrayBuffer());

      let rows: Array<Record<string, string>> = [];

      if (fileName.endsWith(".csv")) {
        const text = fileBuffer.toString("utf8");
        const lines = text.split("\n").filter(Boolean);
        if (lines.length < 2) {
          return c.json(
            apiErrorResponse("INVALID_FILE", "CSV file must have a header row and at least one data row"),
            400
          );
        }
        const headers = (lines[0] as string).split(",").map((h) => h.trim());
        rows = lines.slice(1).map((line) => {
          const values = line.split(",").map((v) => v.trim());
          return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? ""]));
        });
      } else if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
        const XLSX = await import("xlsx");
        const wb = XLSX.read(fileBuffer, { type: "buffer" });
        const ws = wb.Sheets[wb.SheetNames[0] as string]!;
        rows = XLSX.utils.sheet_to_json(ws, { raw: false });
      } else {
        return c.json(apiErrorResponse("INVALID_FILE", "Only .csv and .xlsx files are supported"), 400);
      }

      if (rows.length === 0 || rows.length > 500) {
        return c.json(apiErrorResponse("INVALID_DATA", "File must contain between 1 and 500 data rows"), 400);
      }

      const emails = rows.map((r) => r.email).filter((e): e is string => Boolean(e));
      const existing = await prisma.users.findMany({
        where: { email: { in: emails } },
        select: { email: true }
      });
      const existingEmails = new Set(existing.map((u) => u.email));

      const toCreate = rows.filter((r) => r.email && !existingEmails.has(r.email));
      if (toCreate.length === 0) {
        return c.json(apiSuccessResponse([], "All users already exist, nothing imported"), 200);
      }

      const created = await prisma.$transaction(
        toCreate.map((r) =>
          prisma.users.create({
            data: {
              name: r.name ?? "",
              email: r.email,
              phoneNumber: r.phoneNumber || null,
              occupation: r.occupation || null,
              ...(orgId && {
                organizations: {
                  create: { orgId, role: OrgRole.MEMBER, invitedBy: currentUser.id }
                }
              })
            },
            omit: { wageId: true }
          })
        )
      );
      return c.json(apiSuccessResponse(created, `${created.length} users imported successfully`), 200);
    } catch (error) {
      return handleAPiError(error, "Unexpected error during bulk import");
    }
  })
  // GET /users
  .get("/", requireAuth(), customValidator("query", listUsersQuerySchema), describeRoute(listUsersDocs), async (c) => {
    try {
      const prisma = c.get("prisma");
      const currentUser = c.get("user")!;
      const query = c.req.valid("query");
      const { skip, take, page, limit, orgId, workplaceId, systemRole, occupationCategory, skillLevel } = getPagination(
        query
      ) as ReturnType<typeof getPagination> & typeof query;

      if (currentUser.systemRole !== SystemRole.SUPERADMIN) {
        if (!orgId) {
          return c.json(apiErrorResponse("BAD_REQUEST", "orgId is required for non-SUPERADMIN"), 400);
        }
        const membership = await prisma.orgMembership.findFirst({
          where: { userId: currentUser.id, orgId }
        });
        if (!membership || !MANAGER_ROLES.has(membership.role)) {
          return c.json(apiErrorResponse("FORBIDDEN", "Insufficient organization privileges"), 403);
        }
      }

      const where = {
        ...(orgId && { organizations: { some: { orgId } } }),
        ...(workplaceId && { workplaces: { some: { workplaceId } } }),
        ...(systemRole && { systemRole }),
        ...(occupationCategory && { occupationCategory }),
        ...(skillLevel && { skillLevel })
      };

      const [users, total] = await Promise.all([
        prisma.users.findMany({ where, skip, take, omit: { wageId: true, lastLoginAt: true } }),
        prisma.users.count({ where })
      ]);
      return c.json(
        apiSuccessResponse({ items: users, meta: buildPaginationMeta(page, limit, total) }, "Users retrieved"),
        200
      );
    } catch (error) {
      return handleAPiError(error, "Unexpected error retrieving users");
    }
  })
  // POST /users
  .post("/", requireAuth(), customValidator("json", createUserSchema), describeRoute(createUserDocs), async (c) => {
    try {
      const prisma = c.get("prisma");
      const currentUser = c.get("user")!;

      if (currentUser.systemRole !== SystemRole.SUPERADMIN) {
        return c.json(apiErrorResponse("FORBIDDEN", "Only SUPERADMIN can create users directly"), 403);
      }

      const data = c.req.valid("json");
      const user = await prisma.users.create({ data, omit: { wageId: true } });
      return c.json(apiSuccessResponse(user, "User created successfully"), 201);
    } catch (error) {
      return handleAPiError(error, "Unexpected error creating user");
    }
  })
  // GET /users/:id
  .get("/:id", requireAuth(), customValidator("param", userParamsSchema), describeRoute(getUserDocs), async (c) => {
    try {
      const prisma = c.get("prisma");
      const currentUser = c.get("user")!;
      const { id } = c.req.valid("param");

      const isSelf = currentUser.id === id;
      const isSuperAdmin = currentUser.systemRole === SystemRole.SUPERADMIN;

      if (!isSelf && !isSuperAdmin) {
        return c.json(apiErrorResponse("FORBIDDEN", "You can only view your own profile"), 403);
      }

      const user = await prisma.users.findUnique({
        where: { id },
        omit: {
          wageId: true,
          ...(isSelf ? {} : { lastLoginAt: true })
        }
      });
      if (!user) return c.json(apiErrorResponse("NOT_FOUND", "User not found"), 404);
      return c.json(apiSuccessResponse(user, "User retrieved"), 200);
    } catch (error) {
      return handleAPiError(error, "Unexpected error retrieving user");
    }
  })
  // PATCH /users/:id
  .patch(
    "/:id",
    requireAuth(),
    customValidator("param", userParamsSchema),
    customValidator("json", updateUserSchema),
    describeRoute(updateUserDocs),
    async (c) => {
      try {
        const prisma = c.get("prisma");
        const currentUser = c.get("user")!;
        const { id } = c.req.valid("param");

        const isSelf = currentUser.id === id;
        const isSuperAdmin = currentUser.systemRole === SystemRole.SUPERADMIN;

        if (!isSelf && !isSuperAdmin) {
          return c.json(apiErrorResponse("FORBIDDEN", "You can only update your own profile"), 403);
        }

        const data = c.req.valid("json");
        // Non-SUPERADMIN cannot change systemRole
        if (!isSuperAdmin && data.systemRole) {
          delete data.systemRole;
        }

        const updated = await prisma.users.update({
          where: { id },
          data,
          omit: { wageId: true }
        });
        return c.json(apiSuccessResponse(updated, "User updated successfully"), 200);
      } catch (error) {
        return handleAPiError(error, "Unexpected error updating user");
      }
    }
  )
  // DELETE /users/:id
  .delete(
    "/:id",
    requireAuth(),
    customValidator("param", userParamsSchema),
    describeRoute(deleteUserDocs),
    async (c) => {
      try {
        const prisma = c.get("prisma");
        const currentUser = c.get("user")!;
        const { id } = c.req.valid("param");

        if (currentUser.systemRole !== SystemRole.SUPERADMIN) {
          return c.json(apiErrorResponse("FORBIDDEN", "Only SUPERADMIN can delete users"), 403);
        }
        if (currentUser.id === id) {
          return c.json(apiErrorResponse("BAD_REQUEST", "You cannot delete your own account"), 400);
        }

        const deleted = await prisma.users.delete({ where: { id }, omit: { wageId: true } });
        return c.json(apiSuccessResponse(deleted, "User deleted successfully"), 200);
      } catch (error) {
        return handleAPiError(error, "Unexpected error deleting user");
      }
    }
  )
  // GET /users/:id/attendance
  .get(
    "/:id/attendance",
    requireAuth(),
    customValidator("param", userParamsSchema),
    customValidator("query", paginationQuerySchema),
    describeRoute(getUserAttendanceDocs),
    async (c) => {
      try {
        const prisma = c.get("prisma");
        const currentUser = c.get("user")!;
        const { id } = c.req.valid("param");
        const query = c.req.valid("query");
        const { skip, take, page, limit } = getPagination(query);

        if (!assertSelfOrSuperAdmin(currentUser, id)) {
          // Check shared org MANAGER+
          const sharedOrg = await prisma.orgMembership.findFirst({
            where: {
              userId: currentUser.id,
              role: { in: [OrgRole.OWNER, OrgRole.ADMIN, OrgRole.MANAGER] },
              org: { members: { some: { userId: id } } }
            }
          });
          if (!sharedOrg) {
            return c.json(apiErrorResponse("FORBIDDEN", "Insufficient privileges to view this user's attendance"), 403);
          }
        }

        const [records, total] = await Promise.all([
          prisma.attendance.findMany({ where: { userId: id }, skip, take, orderBy: { date: "desc" } }),
          prisma.attendance.count({ where: { userId: id } })
        ]);
        return c.json(
          apiSuccessResponse(
            { items: records, meta: buildPaginationMeta(page, limit, total) },
            "Attendance history retrieved"
          ),
          200
        );
      } catch (error) {
        return handleAPiError(error, "Unexpected error retrieving attendance history");
      }
    }
  )
  // GET /users/:id/earnings
  .get(
    "/:id/earnings",
    requireAuth(),
    customValidator("param", userParamsSchema),
    customValidator("query", paginationQuerySchema),
    describeRoute(getUserEarningsDocs),
    async (c) => {
      try {
        const prisma = c.get("prisma");
        const currentUser = c.get("user")!;
        const { id } = c.req.valid("param");
        const query = c.req.valid("query");
        const { skip, take, page, limit } = getPagination(query);

        if (!assertSelfOrSuperAdmin(currentUser, id)) {
          const sharedOrg = await prisma.orgMembership.findFirst({
            where: {
              userId: currentUser.id,
              role: { in: [OrgRole.OWNER, OrgRole.ADMIN, OrgRole.MANAGER] },
              org: { members: { some: { userId: id } } }
            }
          });
          if (!sharedOrg) {
            return c.json(apiErrorResponse("FORBIDDEN", "Insufficient privileges to view this user's earnings"), 403);
          }
        }

        const [records, total] = await Promise.all([
          prisma.workerEarnings.findMany({ where: { userId: id }, skip, take, orderBy: { createdAt: "desc" } }),
          prisma.workerEarnings.count({ where: { userId: id } })
        ]);
        return c.json(
          apiSuccessResponse({ items: records, meta: buildPaginationMeta(page, limit, total) }, "Earnings retrieved"),
          200
        );
      } catch (error) {
        return handleAPiError(error, "Unexpected error retrieving earnings");
      }
    }
  )
  // GET /users/:id/payments
  .get(
    "/:id/payments",
    requireAuth(),
    customValidator("param", userParamsSchema),
    customValidator("query", paginationQuerySchema),
    describeRoute(getUserPaymentsDocs),
    async (c) => {
      try {
        const prisma = c.get("prisma");
        const currentUser = c.get("user")!;
        const { id } = c.req.valid("param");
        const query = c.req.valid("query");
        const { skip, take, page, limit } = getPagination(query);

        if (!assertSelfOrSuperAdmin(currentUser, id)) {
          const sharedOrg = await prisma.orgMembership.findFirst({
            where: {
              userId: currentUser.id,
              role: { in: [OrgRole.OWNER, OrgRole.ADMIN, OrgRole.MANAGER] },
              org: { members: { some: { userId: id } } }
            }
          });
          if (!sharedOrg) {
            return c.json(apiErrorResponse("FORBIDDEN", "Insufficient privileges to view this user's payments"), 403);
          }
        }

        const [records, total] = await Promise.all([
          prisma.payment.findMany({ where: { userId: id }, skip, take, orderBy: { createdAt: "desc" } }),
          prisma.payment.count({ where: { userId: id } })
        ]);
        return c.json(
          apiSuccessResponse({ items: records, meta: buildPaginationMeta(page, limit, total) }, "Payments retrieved"),
          200
        );
      } catch (error) {
        return handleAPiError(error, "Unexpected error retrieving payments");
      }
    }
  )
  // GET /users/:id/workplaces
  .get(
    "/:id/workplaces",
    requireAuth(),
    customValidator("param", userParamsSchema),
    customValidator("query", paginationQuerySchema),
    describeRoute(getUserWorkplacesDocs),
    async (c) => {
      try {
        const prisma = c.get("prisma");
        const currentUser = c.get("user")!;
        const { id } = c.req.valid("param");
        const query = c.req.valid("query");
        const { skip, take, page, limit } = getPagination(query);

        if (!assertSelfOrSuperAdmin(currentUser, id)) {
          const sharedOrg = await prisma.orgMembership.findFirst({
            where: {
              userId: currentUser.id,
              role: { in: [OrgRole.OWNER, OrgRole.ADMIN, OrgRole.MANAGER] },
              org: { members: { some: { userId: id } } }
            }
          });
          if (!sharedOrg) {
            return c.json(apiErrorResponse("FORBIDDEN", "Insufficient privileges to view this user's workplaces"), 403);
          }
        }

        const [records, total] = await Promise.all([
          prisma.usersOnWorkplaces.findMany({
            where: { userId: id },
            skip,
            take,
            include: {
              workplace: { include: { org: { select: { id: true, name: true } } } }
            }
          }),
          prisma.usersOnWorkplaces.count({ where: { userId: id } })
        ]);
        return c.json(
          apiSuccessResponse(
            { items: records, meta: buildPaginationMeta(page, limit, total) },
            "User workplaces retrieved"
          ),
          200
        );
      } catch (error) {
        return handleAPiError(error, "Unexpected error retrieving user workplaces");
      }
    }
  )
  // GET /users/:id/timeline
  .get(
    "/:id/timeline",
    requireAuth(),
    customValidator("param", userParamsSchema),
    describeRoute(getUserTimelineDocs),
    async (c) => {
      try {
        const prisma = c.get("prisma");
        const currentUser = c.get("user")!;
        const { id } = c.req.valid("param");

        if (!assertSelfOrSuperAdmin(currentUser, id)) {
          return c.json(apiErrorResponse("FORBIDDEN", "You can only view your own timeline"), 403);
        }

        const [attendance, payments, assignments] = await Promise.all([
          prisma.attendance.findMany({ where: { userId: id }, orderBy: { date: "desc" }, take: 50 }),
          prisma.payment.findMany({ where: { userId: id }, orderBy: { createdAt: "desc" }, take: 50 }),
          prisma.usersOnWorkplaces.findMany({
            where: { userId: id },
            orderBy: { assignedAt: "desc" },
            take: 50,
            include: { workplace: { select: { id: true, name: true } } }
          })
        ]);

        const events = [
          ...attendance.map((a) => ({ type: "attendance" as const, date: a.date, data: a })),
          ...payments.map((p) => ({ type: "payment" as const, date: p.createdAt, data: p })),
          ...assignments.map((a) => ({ type: "assignment" as const, date: a.assignedAt, data: a }))
        ].sort((a, b) => b.date.getTime() - a.date.getTime());

        return c.json(apiSuccessResponse(events, "User timeline retrieved"), 200);
      } catch (error) {
        return handleAPiError(error, "Unexpected error retrieving user timeline");
      }
    }
  )
  // GET /users/:id/skills
  .get(
    "/:id/skills",
    requireAuth(),
    customValidator("param", userParamsSchema),
    describeRoute(listSkillsDocs),
    async (c) => {
      try {
        const prisma = c.get("prisma");
        const currentUser = c.get("user")!;
        const { id } = c.req.valid("param");

        if (!assertSelfOrSuperAdmin(currentUser, id)) {
          return c.json(apiErrorResponse("FORBIDDEN", "You can only view your own skills"), 403);
        }

        const skills = await prisma.userSkill.findMany({ where: { userId: id } });
        return c.json(apiSuccessResponse(skills, "Skills retrieved"), 200);
      } catch (error) {
        return handleAPiError(error, "Unexpected error retrieving skills");
      }
    }
  )
  // POST /users/:id/skills
  .post(
    "/:id/skills",
    requireAuth(),
    customValidator("param", userParamsSchema),
    customValidator("json", createSkillSchema),
    describeRoute(createSkillDocs),
    async (c) => {
      try {
        const prisma = c.get("prisma");
        const currentUser = c.get("user")!;
        const { id } = c.req.valid("param");

        if (!assertSelfOrSuperAdmin(currentUser, id)) {
          return c.json(apiErrorResponse("FORBIDDEN", "You can only manage your own skills"), 403);
        }

        const data = c.req.valid("json");
        const skill = await prisma.userSkill.create({ data: { ...data, userId: id } });
        return c.json(apiSuccessResponse(skill, "Skill created"), 201);
      } catch (error) {
        return handleAPiError(error, "Unexpected error creating skill");
      }
    }
  )
  // PATCH /users/:id/skills/:skillId
  .patch(
    "/:id/skills/:skillId",
    requireAuth(),
    customValidator("param", userParamsSchema.extend(skillParamsSchema.shape)),
    customValidator("json", updateSkillSchema),
    describeRoute(updateSkillDocs),
    async (c) => {
      try {
        const prisma = c.get("prisma");
        const currentUser = c.get("user")!;
        const { id, skillId } = c.req.valid("param");

        if (!assertSelfOrSuperAdmin(currentUser, id)) {
          return c.json(apiErrorResponse("FORBIDDEN", "You can only manage your own skills"), 403);
        }

        const data = c.req.valid("json");
        const skill = await prisma.userSkill.update({
          where: { id: skillId, userId: id },
          data
        });
        return c.json(apiSuccessResponse(skill, "Skill updated"), 200);
      } catch (error) {
        return handleAPiError(error, "Unexpected error updating skill");
      }
    }
  )
  // DELETE /users/:id/skills/:skillId
  .delete(
    "/:id/skills/:skillId",
    requireAuth(),
    customValidator("param", userParamsSchema.extend(skillParamsSchema.shape)),
    describeRoute(deleteSkillDocs),
    async (c) => {
      try {
        const prisma = c.get("prisma");
        const currentUser = c.get("user")!;
        const { id, skillId } = c.req.valid("param");

        if (!assertSelfOrSuperAdmin(currentUser, id)) {
          return c.json(apiErrorResponse("FORBIDDEN", "You can only manage your own skills"), 403);
        }

        const skill = await prisma.userSkill.delete({ where: { id: skillId, userId: id } });
        return c.json(apiSuccessResponse(skill, "Skill deleted"), 200);
      } catch (error) {
        return handleAPiError(error, "Unexpected error deleting skill");
      }
    }
  )
  // GET /users/:id/documents
  .get(
    "/:id/documents",
    requireAuth(),
    customValidator("param", userParamsSchema),
    describeRoute(listDocumentsDocs),
    async (c) => {
      try {
        const prisma = c.get("prisma");
        const currentUser = c.get("user")!;
        const { id } = c.req.valid("param");

        if (!assertSelfOrSuperAdmin(currentUser, id)) {
          return c.json(apiErrorResponse("FORBIDDEN", "You can only view your own documents"), 403);
        }

        const docs = await prisma.userDocument.findMany({ where: { userId: id } });
        return c.json(apiSuccessResponse(docs, "Documents retrieved"), 200);
      } catch (error) {
        return handleAPiError(error, "Unexpected error retrieving documents");
      }
    }
  )
  // POST /users/:id/documents
  .post(
    "/:id/documents",
    requireAuth(),
    customValidator("param", userParamsSchema),
    customValidator("form", uploadDocumentSchema),
    describeRoute(uploadDocumentDocs),
    async (c) => {
      try {
        const prisma = c.get("prisma");
        const currentUser = c.get("user")!;

        const { id } = c.req.valid("param");

        if (!assertSelfOrSuperAdmin(currentUser, id)) {
          return c.json(apiErrorResponse("FORBIDDEN", "You can only manage your own documents"), 403);
        }
        const { documentType, title, expiresAt, notes, file } = c.req.valid("form");
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        const { url, publicId } = await uploadToCloudinary(fileBuffer, `user-documents/${id}`, );

        const doc = await prisma.userDocument.create({
          data: {
            userId: id,
            documentType,
            title,
            fileUrl: url,
            publicId,
            expiresAt: expiresAt ? new Date(expiresAt) : null,
            notes: notes ?? null
          }
        });
        return c.json(apiSuccessResponse(doc, "Document uploaded"), 201);
      } catch (error) {
        console.log("Error uploading document:", error);
        return handleAPiError(error, "Unexpected error uploading document");
      }
    }
  )
  // DELETE /users/:id/documents/:docId
  .delete(
    "/:id/documents/:docId",
    requireAuth(),
    customValidator("param", userParamsSchema.extend(docParamsSchema.shape)),
    describeRoute(deleteDocumentDocs),
    async (c) => {
      try {
        const prisma = c.get("prisma");
        const currentUser = c.get("user")!;
        const { id, docId } = c.req.valid("param");

        if (!assertSelfOrSuperAdmin(currentUser, id)) {
          return c.json(apiErrorResponse("FORBIDDEN", "You can only manage your own documents"), 403);
        }

        const doc = await prisma.userDocument.findUnique({ where: { id: docId, userId: id } });
        if (!doc) return c.json(apiErrorResponse("NOT_FOUND", "Document not found"), 404);

        // Delete from Cloudinary
        if (doc.publicId) {
          await deleteFromCloudinary(doc.publicId).catch(() => {
            // Log but don't fail if Cloudinary delete fails
              console.warn(`Failed to delete document from Cloudinary with publicId ${doc.publicId}`);
          });
        }

        const deleted = await prisma.userDocument.delete({ where: { id: docId } });
        return c.json(apiSuccessResponse(deleted, "Document deleted"), 200);
      } catch (error) {
        return handleAPiError(error, "Unexpected error deleting document");
      }
    }
  )
  // GET /users/:id/emergency-contacts
  .get(
    "/:id/emergency-contacts",
    requireAuth(),
    customValidator("param", userParamsSchema),
    describeRoute(listContactsDocs),
    async (c) => {
      try {
        const prisma = c.get("prisma");
        const currentUser = c.get("user")!;
        const { id } = c.req.valid("param");

        if (!assertSelfOrSuperAdmin(currentUser, id)) {
          return c.json(apiErrorResponse("FORBIDDEN", "You can only view your own emergency contacts"), 403);
        }

        const contacts = await prisma.emergencyContact.findMany({ where: { userId: id } });
        return c.json(apiSuccessResponse(contacts, "Emergency contacts retrieved"), 200);
      } catch (error) {
        return handleAPiError(error, "Unexpected error retrieving emergency contacts");
      }
    }
  )
  // POST /users/:id/emergency-contacts
  .post(
    "/:id/emergency-contacts",
    requireAuth(),
    customValidator("param", userParamsSchema),
    customValidator("json", createContactSchema),
    describeRoute(createContactDocs),
    async (c) => {
      try {
        const prisma = c.get("prisma");
        const currentUser = c.get("user")!;
        const { id } = c.req.valid("param");

        if (!assertSelfOrSuperAdmin(currentUser, id)) {
          return c.json(apiErrorResponse("FORBIDDEN", "You can only manage your own emergency contacts"), 403);
        }

        const data = c.req.valid("json");

        // If isPrimary, clear other primary contacts first
        if (data.isPrimary) {
          await prisma.emergencyContact.updateMany({
            where: { userId: id, isPrimary: true },
            data: { isPrimary: false }
          });
        }

        const contact = await prisma.emergencyContact.create({
          data: { ...data, userId: id }
        });
        return c.json(apiSuccessResponse(contact, "Emergency contact created"), 201);
      } catch (error) {
        return handleAPiError(error, "Unexpected error creating emergency contact");
      }
    }
  )
  // PATCH /users/:id/emergency-contacts/:contactId
  .patch(
    "/:id/emergency-contacts/:contactId",
    requireAuth(),
    customValidator("param", userParamsSchema.extend(contactParamsSchema.shape)),
    customValidator("json", updateContactSchema),
    describeRoute(updateContactDocs),
    async (c) => {
      try {
        const prisma = c.get("prisma");
        const currentUser = c.get("user")!;
        const { id, contactId } = c.req.valid("param");

        if (!assertSelfOrSuperAdmin(currentUser, id)) {
          return c.json(apiErrorResponse("FORBIDDEN", "You can only manage your own emergency contacts"), 403);
        }

        const data = c.req.valid("json");

        let updated;
        if (data.isPrimary) {
          // Primary swap in a transaction
          updated = await prisma.$transaction(async (tx) => {
            await tx.emergencyContact.updateMany({
              where: { userId: id, isPrimary: true, id: { not: contactId } },
              data: { isPrimary: false }
            });
            return tx.emergencyContact.update({
              where: { id: contactId, userId: id },
              data
            });
          });
        } else {
          updated = await prisma.emergencyContact.update({
            where: { id: contactId, userId: id },
            data
          });
        }

        return c.json(apiSuccessResponse(updated, "Emergency contact updated"), 200);
      } catch (error) {
        return handleAPiError(error, "Unexpected error updating emergency contact");
      }
    }
  )
  // DELETE /users/:id/emergency-contacts/:contactId
  .delete(
    "/:id/emergency-contacts/:contactId",
    requireAuth(),
    customValidator("param", userParamsSchema.extend(contactParamsSchema.shape)),
    describeRoute(deleteContactDocs),
    async (c) => {
      try {
        const prisma = c.get("prisma");
        const currentUser = c.get("user")!;
        const { id, contactId } = c.req.valid("param");

        if (!assertSelfOrSuperAdmin(currentUser, id)) {
          return c.json(apiErrorResponse("FORBIDDEN", "You can only manage your own emergency contacts"), 403);
        }

        const contact = await prisma.emergencyContact.delete({ where: { id: contactId, userId: id } });
        return c.json(apiSuccessResponse(contact, "Emergency contact deleted"), 200);
      } catch (error) {
        return handleAPiError(error, "Unexpected error deleting emergency contact");
      }
    }
  );

export default usersRoutes;
