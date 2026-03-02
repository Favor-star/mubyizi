import { redirect } from "next/navigation";
import { MOCK_ORGS } from "@/data/mock";

export default function Page() {
  redirect(`/${MOCK_ORGS[0]!.id}/dashboard`);
}
