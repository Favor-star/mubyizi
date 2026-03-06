"use client";

import React, { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Label } from "@workspace/ui/components/label";
import { Input } from "@workspace/ui/components/input";
import {
  IconMessage,
  IconPlayerPlay,
  IconUser,
} from "@tabler/icons-react";
import { GalleryMedia, GalleryPhaseGroup, MediaType, TradeCategory } from "./types";
import { mockGalleryGroups } from "./_mock/gallery";

const tradeBg: Record<TradeCategory, string> = {
  framing: "from-amber-700 to-amber-500",
  concrete: "from-stone-600 to-stone-400",
  electrical: "from-yellow-700 to-yellow-500",
  plumbing: "from-blue-700 to-blue-500",
};

const tradeCategoryLabels: { value: TradeCategory; label: string }[] = [
  { value: "concrete", label: "Concrete & Foundation" },
  { value: "framing", label: "Framing" },
  { value: "electrical", label: "Electrical" },
  { value: "plumbing", label: "Plumbing" },
];

const mediaTypeLabels: { value: MediaType; label: string }[] = [
  { value: "photo", label: "Photos" },
  { value: "video", label: "Videos" },
  { value: "360", label: "360° Captures" },
];

function MediaCard({ item }: { item: GalleryMedia }) {
  return (
    <div
      className={`relative rounded-lg overflow-hidden aspect-[3/3] bg-gradient-to-br ${tradeBg[item.tradeCategory]} cursor-pointer`}
    >
      {/* Top-left badges */}
      <div className="absolute top-2 left-2 flex gap-1">
        <span className="bg-black/50 text-white text-xs font-semibold px-2 py-0.5 rounded capitalize">
          {item.tradeCategory}
        </span>
        {item.mediaType === "video" && (
          <span className="bg-red-600 text-white text-xs font-semibold px-2 py-0.5 rounded flex items-center gap-1">
            <IconPlayerPlay size={10} strokeWidth={1.5} />
            VIDEO
          </span>
        )}
        {item.mediaType === "360" && (
          <span className="bg-purple-600 text-white text-xs font-semibold px-2 py-0.5 rounded">
            360°
          </span>
        )}
      </div>

      {/* Bottom overlay */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2.5">
        <div className="flex items-center gap-1 mb-1">
          <span className="text-white text-sm font-semibold flex-1 truncate">{item.title}</span>
          <span className="text-white text-xs shrink-0">{item.uploadTime}</span>
        </div>
        <div className="flex items-center gap-1">
          <IconUser size={12} strokeWidth={1.5} className="text-white shrink-0" />
          <span className="text-white text-xs flex-1 truncate">{item.uploadedBy}</span>
          <IconMessage size={12} strokeWidth={1.5} className="text-white shrink-0" />
          <span className="text-white text-xs shrink-0">{item.commentCount}</span>
        </div>
      </div>
    </div>
  );
}

function PhaseGroup({ group }: { group: GalleryPhaseGroup }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <span className={`w-2.5 h-2.5 rounded-full inline-block shrink-0 ${group.dotColorClass}`} />
        <span className="font-semibold text-base">Phase: {group.phase}</span>
        <span className="text-muted-foreground text-sm">{group.date}</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {group.media.map((item) => (
          <MediaCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

export function GalleryTab() {
  const [tradeFilters, setTradeFilters] = useState<TradeCategory[]>(["framing"]);
  const [mediaTypes, setMediaTypes] = useState<MediaType[]>(["photo", "video"]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  function toggleTrade(value: TradeCategory) {
    setTradeFilters((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }

  function toggleMediaType(value: MediaType) {
    setMediaTypes((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }

  function clearAll() {
    setTradeFilters([]);
    setMediaTypes([]);
    setDateFrom("");
    setDateTo("");
  }

  const filteredGroups = mockGalleryGroups
    .map((group) => ({
      ...group,
      media: group.media.filter((item) => {
        const tradeOk = tradeFilters.length === 0 || tradeFilters.includes(item.tradeCategory);
        const mediaOk = mediaTypes.length === 0 || mediaTypes.includes(item.mediaType);
        return tradeOk && mediaOk;
      }),
    }))
    .filter((group) => group.media.length > 0);

  return (
    <div className="bg-background px-8 py-4 flex gap-5 items-start">
      {/* Filter Sidebar */}
      <aside className="w-[260px] shrink-0 bg-sidebar border rounded-lg p-4 space-y-5">
        <div className="flex items-center justify-between">
          <span className="font-bold text-sm">Filters</span>
          <button
            onClick={clearAll}
            className="text-primary text-sm cursor-pointer hover:underline"
          >
            Clear all
          </button>
        </div>

        {/* Trade Category */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Trade Category
          </p>
          <div className="space-y-2">
            {tradeCategoryLabels.map(({ value, label }) => (
              <div key={value} className="flex items-center gap-2">
                <Checkbox
                  id={`trade-${value}`}
                  checked={tradeFilters.includes(value)}
                  onCheckedChange={() => toggleTrade(value)}
                />
                <Label htmlFor={`trade-${value}`} className="text-sm font-normal cursor-pointer">
                  {label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Date Range */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Date Range
          </p>
          <div className="space-y-2">
            <div>
              <Label htmlFor="date-from" className="text-xs text-muted-foreground mb-1 block">
                From
              </Label>
              <Input
                id="date-from"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="date-to" className="text-xs text-muted-foreground mb-1 block">
                To
              </Label>
              <Input
                id="date-to"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Media Type */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Media Type
          </p>
          <div className="space-y-2">
            {mediaTypeLabels.map(({ value, label }) => (
              <div key={value} className="flex items-center gap-2">
                <Checkbox
                  id={`media-${value}`}
                  checked={mediaTypes.includes(value)}
                  onCheckedChange={() => toggleMediaType(value)}
                />
                <Label htmlFor={`media-${value}`} className="text-sm font-normal cursor-pointer">
                  {label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Content Area */}
      <div className="flex-1 min-w-0">
        {filteredGroups.length === 0 ? (
          <p className="text-muted-foreground text-sm py-8 text-center">
            No media matches the current filters.
          </p>
        ) : (
          filteredGroups.map((group) => (
            <PhaseGroup key={group.phase} group={group} />
          ))
        )}

        <div className="flex justify-center mt-2">
          <Button variant="outline" className="mx-auto flex">
            Load More Media
          </Button>
        </div>
      </div>
    </div>
  );
}
