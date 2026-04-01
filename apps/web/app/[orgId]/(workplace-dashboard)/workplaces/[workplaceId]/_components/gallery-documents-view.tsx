"use client";
import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { GalleryTab } from "./gallery-tab";
import { WorkplaceDocumentsTab } from "./workplace-documents-tab";
import { useParams, usePathname, useSearchParams, useRouter } from "next/navigation";
const TAB = "gallery_tab";
export function GalleryDocumentsView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = React.useState(searchParams.get(TAB) || "media");
  const handleTabChange = React.useCallback(
    (val: string) => {
      setActiveTab(val);
      const params = new URLSearchParams(searchParams.toString());
      params.set(TAB, val);
      router.push(pathname + "?" + params.toString());
    },
    [searchParams, router, pathname]
  );
  return (
    <Tabs defaultValue="media" value={activeTab} className="w-full" onValueChange={handleTabChange}>
      <div className="mx-8 pt-4 border-b border-border">
        <TabsList className="bg-inherit" variant={"line"}>
          <TabsTrigger value="media" className="w-fit">
            Media
          </TabsTrigger>
          <TabsTrigger value="documents" className="w-fit">
            Documents
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="media" className="mt-0">
        <GalleryTab />
      </TabsContent>
      <TabsContent value="documents" className="mt-0">
        <WorkplaceDocumentsTab />
      </TabsContent>
    </Tabs>
  );
}
