"use client";
import React, { useEffect, useState } from "react";
import { createUsersClient } from "@workspace/api-client";
import useSWR from "swr";
import { rpc, safeRpc, RpcError } from "@workspace/api-client/fetcher";
import { Button } from "@workspace/ui/components/button";

const user = createUsersClient(process.env.NEXT_PUBLIC_API_URL!);

// Helper to derive the result type of safeRpc without spelling out the generics
const fetchSingleUser = (id: string) => safeRpc(user.get(id));
type SingleUserResult = Awaited<ReturnType<typeof fetchSingleUser>>;

export const TestData = () => {
  const [orgId, setOrgId] = useState<string | null>(null);
  // ── rpc() + SWR — throws become SWR's `error` state ────────────────────────
  // Key encodes the args so cache entries don't collide across pages/filters
  const { data: listData, error: listError } = useSWR(
    ["/users/list", { page: "1", limit: "5", orgId }],
    ([, { page, limit, orgId }]) => rpc(user.list({ query: { page, limit, orgId: orgId ?? undefined } }))
  );

  // `instanceof RpcError` narrows the error body to ApiErrorBody
  if (listError instanceof RpcError) {
    console.error("[list] API error:", listError.body.message);
  }

  // ── safeRpc() one-off — discriminated union, no try/catch ──────────────────
  const [singleUser, setSingleUser] = useState<SingleUserResult | null>(null);

  useEffect(() => {
    const load = async () => {
      const result = await fetchSingleUser("some-id");

      if (!result.ok) {
        // result.error is ApiErrorBody — fully typed, no narrowing needed
        console.error("[get] API error:", result.error.message);
        setSingleUser(result);
        return;
      }
      console.log("THE Thrown response:", result);

      // result.data is the typed 200 success body
      console.log("[get] user:", result.data);
      setSingleUser(result);
    };

    load();
  }, []);

  return (
    <div className="p-4 space-y-4 font-mono text-sm">
      <section>
        <h2 className="font-bold mb-1">rpc() + SWR (list)</h2>
        {listError instanceof RpcError && <p className="text-destructive">Error: {listError.body.message}</p>}
        <pre>
          {listData &&
            JSON.stringify(
              listData.data.items.map((item) => ({ id: item.id, name: item.name })),
              null,
              2
            )}
        </pre>
      </section>

      <section>
        <h2 className="font-bold mb-1">safeRpc() one-off (get)</h2>
        {singleUser && !singleUser.ok && <p className="text-red-500">Error: {singleUser.error.message}</p>}
        {singleUser?.ok && <pre>{JSON.stringify(singleUser.data, null, 2)}</pre>}
      </section>
      <section>
        <Button onClick={() => setOrgId("01KHY2NV72575AJBJ85NMP8HP8")}>Change Org Id</Button>
      </section>
    </div>
  );
};
