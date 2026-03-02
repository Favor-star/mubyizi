import type { ClientRequestOptions } from "hono/client";
import { hc } from "hono/client";
import type { UsersRouteType } from "@workspace/api/routes/users";

type HonoClient = ReturnType<typeof hc<UsersRouteType>>;
type HonoIndex = HonoClient["index"];
type ById = HonoClient[":id"];
type ByIdSkill = ById["skills"][":skillId"];
type ByIdContact = ById["emergency-contacts"][":contactId"];

/** Strips the `param` key from a route input type, leaving only body/query/form keys. */
type WithoutParam<T> = Omit<T, "param">;

export function createUsersClient(apiRoot: string, options?: ClientRequestOptions) {
  const c = hc<UsersRouteType>(`${apiRoot}/api/v1/users`, {
    ...options,
    fetch: (input: RequestInfo | URL, init?: RequestInit) => fetch(input, { ...init, credentials: "include" })
  });

  return {
    // ── Collection ───────────────────────────────────────────────────────────
    list: (input?: Parameters<HonoIndex["$get"]>[0]) => c.index.$get(input!),

    create: (input: Parameters<HonoIndex["$post"]>[0]) => c.index.$post(input),

    // ── Single resource ───────────────────────────────────────────────────────
    get: (id: string) => c[":id"].$get({ param: { id } }),

    update: (id: string, rest: WithoutParam<Parameters<ById["$patch"]>[0]>) =>
      c[":id"].$patch({ param: { id }, ...rest } as Parameters<ById["$patch"]>[0]),

    delete: (id: string) => c[":id"].$delete({ param: { id } }),

    // ── Sub-resource reads ────────────────────────────────────────────────────
    attendance: (id: string, rest?: WithoutParam<Parameters<ById["attendance"]["$get"]>[0]>) =>
      c[":id"].attendance.$get({ param: { id }, ...rest } as Parameters<ById["attendance"]["$get"]>[0]),

    earnings: (id: string, rest?: WithoutParam<Parameters<ById["earnings"]["$get"]>[0]>) =>
      c[":id"].earnings.$get({ param: { id }, ...rest } as Parameters<ById["earnings"]["$get"]>[0]),

    payments: (id: string, rest?: WithoutParam<Parameters<ById["payments"]["$get"]>[0]>) =>
      c[":id"].payments.$get({ param: { id }, ...rest } as Parameters<ById["payments"]["$get"]>[0]),

    workplaces: (id: string, rest?: WithoutParam<Parameters<ById["workplaces"]["$get"]>[0]>) =>
      c[":id"].workplaces.$get({ param: { id }, ...rest } as Parameters<ById["workplaces"]["$get"]>[0]),

    timeline: (id: string) => c[":id"].timeline.$get({ param: { id } }),

    // ── Skills ────────────────────────────────────────────────────────────────
    skills: {
      list: (id: string) => c[":id"].skills.$get({ param: { id } }),

      create: (id: string, rest: WithoutParam<Parameters<ById["skills"]["$post"]>[0]>) =>
        c[":id"].skills.$post({ param: { id }, ...rest } as Parameters<ById["skills"]["$post"]>[0]),

      update: (id: string, skillId: string, rest: WithoutParam<Parameters<ByIdSkill["$patch"]>[0]>) =>
        c[":id"].skills[":skillId"].$patch({ param: { id, skillId }, ...rest } as Parameters<ByIdSkill["$patch"]>[0]),

      delete: (id: string, skillId: string) => c[":id"].skills[":skillId"].$delete({ param: { id, skillId } })
    },

    // ── Documents ─────────────────────────────────────────────────────────────
    documents: {
      list: (id: string) => c[":id"].documents.$get({ param: { id } }),

      upload: (id: string, rest: WithoutParam<Parameters<ById["documents"]["$post"]>[0]>) =>
        c[":id"].documents.$post({ param: { id }, ...rest } as Parameters<ById["documents"]["$post"]>[0]),

      delete: (id: string, docId: string) => c[":id"].documents[":docId"].$delete({ param: { id, docId } })
    },

    // ── Emergency contacts ────────────────────────────────────────────────────
    emergencyContacts: {
      list: (id: string) => c[":id"]["emergency-contacts"].$get({ param: { id } }),

      create: (id: string, rest: WithoutParam<Parameters<ById["emergency-contacts"]["$post"]>[0]>) =>
        c[":id"]["emergency-contacts"].$post({ param: { id }, ...rest } as Parameters<
          ById["emergency-contacts"]["$post"]
        >[0]),

      update: (id: string, contactId: string, rest: WithoutParam<Parameters<ByIdContact["$patch"]>[0]>) =>
        c[":id"]["emergency-contacts"][":contactId"].$patch({ param: { id, contactId }, ...rest } as Parameters<
          ByIdContact["$patch"]
        >[0]),

      delete: (id: string, contactId: string) =>
        c[":id"]["emergency-contacts"][":contactId"].$delete({ param: { id, contactId } })
    },

    // ── Bulk operations ───────────────────────────────────────────────────────
    export: (input?: Parameters<HonoClient["export"]["$get"]>[0]) => c.export.$get(input!),

    bulkImport: (input: Parameters<HonoClient["bulk-import"]["$post"]>[0]) => c["bulk-import"].$post(input)
  };
}

export type UsersClient = ReturnType<typeof createUsersClient>;
