import React from "react";

export function PageHeader({
  children,
  title,
  description
}: {
  children?: React.ReactNode;
  title: React.ReactNode;
  description: string;
}) {
  return (
    <hgroup className="flex items-center justify-between bg-sidebar border-b border-border pt-4 p-4">
      <header>
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </header>
      <div className="flex gap-3">{children}</div>
    </hgroup>
  );
}
