import type { ClientResponse } from "hono/client";

type InferSuccess<T> = T extends ClientResponse<infer Body, 200, any> ? Body : never;

// Standard error envelope — matches apiErrorResponse() shape from the API
export type ApiErrorBody = { data: null; error: string; message: string; success: false };

// Typed error class — lets callers narrow via `instanceof RpcError` in catch blocks
export class RpcError extends Error {
  constructor(public readonly body: ApiErrorBody) {
    super(body.message);
    this.name = "RpcError";
  }
}

/**
 * Unwraps a Hono ClientResponse promise into the typed success body.
 * Throws `RpcError` on non-2xx — SWR captures this in its `error` state.
 *
 * Use for: SWR reads, or anywhere try/catch is acceptable.
 *
 * @example
 * // SWR
 * const { data, error } = useSWR(["/users", page], () => rpc(user.list({ query: { page } })));
 * if (error instanceof RpcError) console.error(error.body.message);
 *
 * // try/catch
 * try {
 *   const data = await rpc(user.update(id, { json: body }));
 * } catch (e) {
 *   if (e instanceof RpcError) console.error(e.body.error);
 * }
 */
export const rpc = async <TRes extends ClientResponse<any, any, any>>(
  responsePromise: Promise<TRes>
): Promise<InferSuccess<TRes>> => {
  const res = await responsePromise;
  if (!res.ok) throw new RpcError((await res.json()) as ApiErrorBody);
  return res.json() as InferSuccess<TRes>;
};

// Discriminated union returned by safeRpc
export type RpcResult<T> = { ok: true; data: T; error: null } | { ok: false; data: null; error: ApiErrorBody };

/**
 * Unwraps a Hono ClientResponse promise into a discriminated union — never throws.
 * TypeScript narrows `data` and `error` correctly after checking `result.ok`.
 *
 * Use for: mutations, one-off fetches where you want to avoid try/catch.
 *
 * @example
 * const result = await safeRpc(user.update(id, { json: body }));
 * if (!result.ok) {
 *   console.error(result.error.message); // typed ApiErrorBody
 *   return;
 * }
 * console.log(result.data); // typed success body
 */
export const safeRpc = async <TRes extends ClientResponse<any, any, any>>(
  responsePromise: Promise<TRes>
): Promise<RpcResult<InferSuccess<TRes>>> => {
  const res = await responsePromise;
  const body = await res.json();
  if (!res.ok) return { ok: false, data: null, error: body as ApiErrorBody };
  return { ok: true, error: null, ...(body as InferSuccess<TRes>) };
};
