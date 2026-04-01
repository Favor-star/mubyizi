"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogDescription
} from "@workspace/ui/components/dialog";
import { ItemSeparator } from "@workspace/ui/components/item";
import { Separator } from "@workspace/ui/components/separator";
import React from "react";

export const DialogWrapper = ({
  trigger,
  title,
  description,
  children
}: {
  trigger: React.ReactNode;
  title: string | React.ReactNode;
  description: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className="sm:max-w-11/12 max-w-11/12 md:max-w-5xl "
        onPointerDownOutside={(e) => {
          e.preventDefault();
          console.log("pointer down Outside");
        }}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
          <Separator />
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};
