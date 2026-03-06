import React from "react";
import { CostTracking } from "./cost-tracking";
import { SiteMap } from "./site-map";
import { AssignedWorkers } from "./assigned-workers";
import { RecentImages } from "./recent-images";
import { ProjectSummary } from "./project-summary";

export const OverviewTab = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2">
        <ProjectSummary />
        <RecentImages />
        <AssignedWorkers />
      </div>
      <div className="md:col-span-1 space-y-4">
        <SiteMap />
        <CostTracking />
      </div>
    </section>
  );
};
