import { redirect } from "next/navigation";

const SingleSitePage = async ({ params }: { params: Promise<{ orgId: string; workplaceId: string }> }) => {
  redirect(`/${(await params).orgId}/workplaces/${(await params).workplaceId}/overview`);
};

export default SingleSitePage;
