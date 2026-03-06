import { ModeToggle } from "@/shared/components/mode-toggle";
import { IconSearch } from "@tabler/icons-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@workspace/ui/components/breadcrumb";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@workspace/ui/components/input-group";
import { SidebarTrigger } from "@workspace/ui/components/sidebar";
import Link from "next/link";
import React from "react";

export const WorkplacePageHeader = ({ title, children }: { title: string; children?: React.ReactNode }) => {
  return (
    <section className="ps-8 py-4 pe-4 bg-sidebar">
      <hgroup className="w-full flex justify-between">
        <header className="flex gap-2 items-center">
          <SidebarTrigger />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="..">Workplace</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="overview">Workplace name</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>{title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <section className="flex gap-2 items-center">
          <InputGroup>
            <InputGroupAddon>
              <IconSearch />
            </InputGroupAddon>
            <InputGroupInput placeholder="Search..."></InputGroupInput>
            <InputGroupAddon align={"inline-end"}>
              <InputGroupText>0 results</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
          <div className="border border-border">
            <ModeToggle />
          </div>
        </section>
      </hgroup>
      {children}
    </section>
  );
};
