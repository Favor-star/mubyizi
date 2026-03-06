"use client";
import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SingleSiteHeader } from "./components/single-site-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import {
  IconCalendarWeek,
  IconDashboard,
  IconList,
  IconMoneybag,
  IconPhoto,
  IconSettings,
  IconUsers
} from "@tabler/icons-react";
import { ProjectSummary } from "./components/project-summary";
import { RecentImages } from "./components/recent-images";
import { AssignedWorkers } from "./components/assigned-workers";
import { SiteMap } from "./components/site-map";
import { CostTracking } from "./components/cost-tracking";
import { WorkersTab } from "./components/workers-tab";
import { BudgetTab } from "./components/budget-tab";
import { GalleryTab } from "./components/gallery-tab";
import { OverviewTab } from "./components/overview-tab";

const TABS_VALUES = {
  overview: "overview",
  workers: "workers",
  settings: "settings",
  budget: "budget",
  gallery: "gallery",
  timeline: "timeline"
} as const;

type TabValue = (typeof TABS_VALUES)[keyof typeof TABS_VALUES];

const SingleSitepage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tab = searchParams.get("tab");

  const validTabs = Object.values(TABS_VALUES);

  const tabValue: TabValue = validTabs.includes(tab as TabValue) ? (tab as TabValue) : "overview";

  useEffect(() => {
    if (!validTabs.includes(tab as TabValue)) {
      router.replace("?tab=overview");
    }
  }, [tab, router]);
  return (
    <section className="">
      <SingleSiteHeader activeTab={tabValue} />
      <section className="w-full bg-sidebar pb-0  ">
        <Tabs value={tabValue} onValueChange={(v) => router.replace(`?tab=${v}`)} className="gap-0">
          <div className="w-full border-b px-8">
            <TabsList variant={"line"}>
              <TabsTrigger value={`${TABS_VALUES.overview}`}>
                <IconDashboard strokeWidth={1.5} stroke={1.25} />
                Overview
              </TabsTrigger>
              <TabsTrigger value={`${TABS_VALUES.workers}`}>
                <IconUsers strokeWidth={1.5} stroke={1.25} />
                Workers
              </TabsTrigger>
              <TabsTrigger value={`${TABS_VALUES.settings}`}>
                <IconSettings strokeWidth={1.5} stroke={1.25} />
                Settings
              </TabsTrigger>
              <TabsTrigger value={`${TABS_VALUES.budget}`}>
                <IconMoneybag strokeWidth={1.5} stroke={1.25} />
                Budget
              </TabsTrigger>
              <TabsTrigger value={`${TABS_VALUES.gallery}`}>
                <IconPhoto strokeWidth={1.5} stroke={1.25} />
                Gallery
              </TabsTrigger>
              <TabsTrigger value={`${TABS_VALUES.timeline}`}>
                <IconCalendarWeek strokeWidth={1.5} stroke={1.25} />
                Timeline
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value={`${TABS_VALUES.overview}`} className="bg-background px-8 py-3">
            <OverviewTab />
          </TabsContent>
          <TabsContent value={`${TABS_VALUES.workers}`}>
            <WorkersTab />
          </TabsContent>
          <TabsContent value={`${TABS_VALUES.budget}`}>
            <BudgetTab />
          </TabsContent>
          <TabsContent value={`${TABS_VALUES.gallery}`}>
            <GalleryTab />
          </TabsContent>
        </Tabs>
      </section>
    </section>
  );
};

export default SingleSitepage;
