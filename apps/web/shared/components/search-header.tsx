"use client";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@workspace/ui/components/input-group";
import { IconChevronDown, IconFilter2, IconSearch } from "@tabler/icons-react";
import { Button } from "@workspace/ui/components/button";
import { MultipleSelectorDropDown } from "./multiple-selector-dropdown";
import React from "react";

export type FilterOption = { label: string; value: string };
export type FilterConfig = {
  key: string;
  label: string;
  options: FilterOption[];
};

type SearchHeaderProps = {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;
  resultCount?: number;
  filters?: FilterConfig[];
  filterValues?: Record<string, string[]>;
  onFilterChange?: (key: string, values: string[]) => void;
  onMoreFilters?: () => void;
  actions?: React.ReactNode;
};

function getFilterLabel(config: FilterConfig, values: string[]): string {
  if (!values || values.length === 0) return "All";
  if (values.length === 1) return config.options.find((o) => o.value === values[0])?.label ?? values[0] ?? "Unknown";
  return `${values.length} selected`;
}

export const SearchHeader = ({
  searchQuery,
  onSearchChange,
  searchPlaceholder,
  resultCount,
  filters,
  filterValues = {},
  onFilterChange,
  onMoreFilters,
  actions
}: SearchHeaderProps) => {
  return (
    <section className="flex gap-4 py-3 justify-between">
      <article aria-label="Search and filters" className="flex gap-6">
        <InputGroup className="max-w-sm bg-background">
          <InputGroupInput
            placeholder={searchPlaceholder ?? "Search..."}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <InputGroupAddon>
            <IconSearch />
          </InputGroupAddon>
          {resultCount !== undefined && <InputGroupAddon align="inline-end">{resultCount} results</InputGroupAddon>}
        </InputGroup>
        <div aria-label="Filters" className="flex items-center gap-2">
          {filters?.map((config) => {
            const vals = filterValues[config.key] ?? [];
            const label = getFilterLabel(config, vals);
            return (
              <MultipleSelectorDropDown
                key={config.key}
                options={config.options}
                title={`Filter by ${config.label}`}
                value={vals}
                onValueChange={(next) => onFilterChange?.(config.key, next)}
                trigger={
                  <Button variant="outline">
                    <span className="text-muted-foreground">{config.label}:</span> {label} <IconChevronDown />
                  </Button>
                }
              />
            );
          })}
          {onMoreFilters && (
            <Button variant="outline" onClick={onMoreFilters}>
              <IconFilter2 />
              More filters
            </Button>
          )}
        </div>
      </article>
      {actions && <div className="flex gap-2">{actions}</div>}
    </section>
  );
};
