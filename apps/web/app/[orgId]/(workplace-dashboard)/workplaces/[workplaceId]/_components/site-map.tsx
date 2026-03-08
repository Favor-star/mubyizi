import React from "react";
import {
  IconArrowAutofitLeft,
  IconArrowBadgeRight,
  IconArrowsMaximize,
  IconArrowsRightLeft,
  IconArrowUpRight,
  IconMapPin
} from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";

export const SiteMap = () => {
  return (
    <section className="bg-sidebar border">
      <div className="relative aspect-square bg-muted w-full overflow-hidden">
        {/* Map placeholder */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
          <IconMapPin strokeWidth={1.5} className="h-10 w-10 opacity-30" />
          <span className="text-sm opacity-50">Map Preview</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 bg-background/80 hover:bg-background">
          <IconArrowsMaximize strokeWidth={1.5} className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <p className="font-bold text-sm leading-none">Main Job Site</p>
          <p className="text-xs text-muted-foreground mt-0.5">Metro City, Sector 7</p>
        </div>
        <Button variant="link" size="sm" className="text-sm h-auto p-0 group">
          Get Directions
          <IconArrowUpRight className="group-hover:rotate-45 transform transition-transform" />
        </Button>
      </div>
    </section>
  );
};
