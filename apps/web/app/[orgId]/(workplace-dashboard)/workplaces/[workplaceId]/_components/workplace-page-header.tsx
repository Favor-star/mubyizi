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

export const WorkplacePageHeader = ({
  title,
  children,
  breadcrumbLinks,
  rootCrumbs
}: {
  title: string;
  children?: React.ReactNode;
  breadcrumbLinks?: { href: string; label: string }[];
  rootCrumbs?: { href?: string; label: string }[];
}) => {
  return (
    <section className="px-4 py-4 bg-sidebar border-b border-border">
      <hgroup className="w-full flex justify-between">
        <header className="flex gap-2 items-center">
          <SidebarTrigger />
          <Breadcrumb>
            <BreadcrumbList>
              {rootCrumbs ? (
                <>
                  {rootCrumbs.map((crumb, index) => (
                    <React.Fragment key={index}>
                      <BreadcrumbItem>
                        {crumb.href ? (
                          <BreadcrumbLink asChild>
                            <Link href={crumb.href}>{crumb.label}</Link>
                          </BreadcrumbLink>
                        ) : (
                          <BreadcrumbLink>{crumb.label}</BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      <BreadcrumbSeparator>/</BreadcrumbSeparator>
                    </React.Fragment>
                  ))}
                </>
              ) : (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href="../">Workplace</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator>/</BreadcrumbSeparator>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href="overview">Workplace name</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator>/</BreadcrumbSeparator>
                  {breadcrumbLinks?.map((link, index) => (
                    <React.Fragment key={index}>
                      <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                          <Link href={link.href}>{link.label}</Link>
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator>/</BreadcrumbSeparator>
                    </React.Fragment>
                  ))}
                </>
              )}
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
