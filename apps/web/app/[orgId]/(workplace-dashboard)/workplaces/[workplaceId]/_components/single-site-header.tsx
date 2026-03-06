import { ModeToggle } from "@/shared/components/mode-toggle";
import { IconEdit, IconMapPin, IconPoint, IconSearch, IconUpload, IconUserPlus } from "@tabler/icons-react";
import { Badge } from "@workspace/ui/components/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@workspace/ui/components/breadcrumb";
import { Button } from "@workspace/ui/components/button";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@workspace/ui/components/input-group";
import { Separator } from "@workspace/ui/components/separator";
import { SidebarTrigger } from "@workspace/ui/components/sidebar";
import Link from "next/link";
import React from "react";

export const SingleSiteHeader = () => {
  return (
    <section className="px-4 py-4  bg-sidebar border-b border-border">
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
                <BreadcrumbPage>Site name</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <section className="flex gap-2 items-center">
          <InputGroup>
            <InputGroupAddon>
              <IconSearch />
            </InputGroupAddon>
            <InputGroupInput placeholder="Search sites..."></InputGroupInput>
            <InputGroupAddon align={"inline-end"}>
              <InputGroupText>0 results</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
          <div className="border border-border ">
            <ModeToggle />
          </div>
        </section>
      </hgroup>
    </section>
  );
};
