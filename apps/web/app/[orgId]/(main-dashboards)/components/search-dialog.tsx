"use client";

import * as React from "react";
import {
  IconSearch,
  IconCalendar,
  IconCreditCard,
  IconSettings,
  IconUser,
  IconCalculator,
  IconMoodSmile
} from "@tabler/icons-react";
import { useIsMobile } from "@workspace/ui/hooks/use-mobile";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut
} from "@workspace/ui/components/command";

export const SearchDialog = () => {
  const [open, setOpen] = React.useState(false);
  const isMobile = useIsMobile();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          "relative h-9 justify-start text-sm text-muted-foreground w-full sm:w-64 lg:w-64 xl:w-96",
          isMobile && "h-10 w-10 px-0"
        )}
        onClick={() => setOpen(true)}>
        <IconSearch className="size-4 shrink-0 sm:mr-2" />
        <span className="hidden sm:inline-flex">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>
                <IconCalendar className="mr-2 size-4" />
                <span>Calendar</span>
              </CommandItem>
              <CommandItem>
                <IconMoodSmile className="mr-2 size-4" />
                <span>Search Emoji</span>
              </CommandItem>
              <CommandItem>
                <IconCalculator className="mr-2 size-4" />
                <span>Calculator</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
              <CommandItem>
                <IconUser className="mr-2 size-4" />
                <span>Profile</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <IconCreditCard className="mr-2 size-4" />
                <span>Billing</span>
                <CommandShortcut>⌘B</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <IconSettings className="mr-2 size-4" />
                <span>Settings</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
};
