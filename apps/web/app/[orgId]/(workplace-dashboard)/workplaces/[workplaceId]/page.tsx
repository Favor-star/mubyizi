import React from "react";
import { SingleSiteHeader } from "./components/single-site-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import {
  IconCalendarWeek,
  IconDashboard,
  IconList,
  IconMoneybag,
  IconPhoto,
  IconPictureInPicture,
  IconSettings,
  IconUsers
} from "@tabler/icons-react";

const SingleSitepage = () => {
  return (
    <section className="">
      <SingleSiteHeader />
      <section className="w-full bg-sidebar pb-0  ">
        <Tabs defaultValue="overview" className="gap-0">
          <div className="w-full border-b px-8">
            <TabsList variant={"line"}>
              <TabsTrigger value="overview">
                <IconDashboard strokeWidth={1.5} stroke={1.25} />
                Overview
              </TabsTrigger>
              <TabsTrigger value="workers">
                <IconUsers strokeWidth={1.5} stroke={1.25} />
                Workers
              </TabsTrigger>
              <TabsTrigger value="details">
                <IconList strokeWidth={1.5} stroke={1.25} />
                Details
              </TabsTrigger>
              <TabsTrigger value="settings">
                <IconSettings strokeWidth={1.5} stroke={1.25} />
                Settings
              </TabsTrigger>
              <TabsTrigger value="budget">
                <IconMoneybag strokeWidth={1.5} stroke={1.25} />
                Budget
              </TabsTrigger>
              <TabsTrigger value="gallery">
                <IconPhoto strokeWidth={1.5} stroke={1.25} />
                Gallery
              </TabsTrigger>
              <TabsTrigger value="timeline">
                <IconCalendarWeek strokeWidth={1.5} stroke={1.25} />
                Timeline
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="overview" className="bg-background px-8 py-3">
            <p>Overview content goes here...</p>
          </TabsContent>
          <TabsContent value="details" className="bg-background px-8 py-3">
            <p>Details content goes here...</p>
          </TabsContent>
          
        </Tabs>
      </section>
    </section>
  );
};

export default SingleSitepage;
