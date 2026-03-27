"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { GalleryTab } from "./gallery-tab";
import { WorkplaceDocumentsTab } from "./workplace-documents-tab";

export function GalleryDocumentsView() {
  return (
    <Tabs defaultValue="media" className="w-full">
      <div className="px-8 pt-2">
        <TabsList>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
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
