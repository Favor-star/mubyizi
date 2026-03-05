import { ModeToggle } from "@/shared/components/mode-toggle";
import {
  IconArrowLeft,
  IconArrowNarrowRight,
  IconCommand,
  IconEdit,
  IconMapPin,
  IconPoint,
  IconSearch,
  IconUpload,
  IconUserPlus
} from "@tabler/icons-react";
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
import Link from "next/link";
import React from "react";

export const SingleSiteHeader = () => {
  return (
    <section className="ps-8 py-4 pe-4 bg-sidebar">
      <hgroup className="w-full flex justify-between">
        <header className="flex gap-6 items-center">
          <h1 className="font-bold flex items-center gap-2">
            <div className="p-1 text-primary bg-white  ">
              <IconCommand strokeWidth={1.3} />
            </div>
            SITE ORGNAME HERE
          </h1>
          <Button variant={"link"} size={"sm"} asChild>
            <Link href={`.`}>
              <IconArrowLeft />
              Go back to dashboard
            </Link>
          </Button>
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
      <section className="mt-8 mb-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href=".">Workplace</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Site name</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex justify-between items-center ">
          <hgroup>
            <h1 className="text-2xl font-bold mt-2">Site name</h1>
            <div className="flex items-end gap-5">
              <p className="text-sm text-muted-foreground">
                <span className="italic">Type: </span>
                <span>PROJECT</span>
              </p>
              <p className="flex items-center text-sm text-muted-foreground mt-1">
                <IconMapPin className="mr-2" strokeWidth={1.5} size={18} />
                Kigali, Rwanda
              </p>{" "}
              <Badge variant={"outline"} className="border-success text-success">
                <IconPoint />
                Active
              </Badge>
            </div>
          </hgroup>
          <div className="flex gap-3 items-center">
            <Button variant={"outline"} size={"lg"}>
              <IconEdit />
              Edit details
            </Button>
            <Button variant={"outline"} size={"lg"}>
              <IconUserPlus />
              Add workers
            </Button>
            <Separator orientation="vertical" />
            <Button variant={"default"} size={"lg"}>
              <IconUpload />
              Upload
            </Button>
          </div>
        </div>
      </section>
    </section>
  );
};
