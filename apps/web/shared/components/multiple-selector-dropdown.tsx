"use client";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger
} from "@workspace/ui/components/popover";
import { Field, FieldGroup, FieldLabel } from "@workspace/ui/components/field";
import React from "react";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Button } from "@workspace/ui/components/button";

export const MultipleSelectorDropDown = ({
  trigger,
  children,
  options,
  title,
  description,
  value,
  onValueChange
}: {
  trigger: React.ReactNode;
  children?: React.ReactNode;
  options: { label: string; value: string }[];
  title?: string;
  description?: string;
  value?: string[];
  onValueChange?: (value: string[]) => void;
}) => {
  const [internalValue, setInternalValue] = React.useState<string[]>([]);
  const isControlled = value !== undefined;
  const selectedValues = isControlled ? value : internalValue;

  const handleToggle = (optionValue: string) => {
    const next = selectedValues.includes(optionValue)
      ? selectedValues.filter((v) => v !== optionValue)
      : [...selectedValues, optionValue];
    if (!isControlled) setInternalValue(next);
    onValueChange?.(next);
  };

  const handleClearAll = () => {
    if (!isControlled) setInternalValue([]);
    onValueChange?.([]);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>{title ?? "Select Options"}</PopoverTitle>
          <PopoverDescription>{description ?? "Select all that apply"}</PopoverDescription>
          {selectedValues.length > 0 && (
            <Button variant="ghost" size="sm" onClick={handleClearAll}>
              Clear all
            </Button>
          )}
          <div className="py-2 flex flex-col gap-2">
            {options && options.length > 0 ? (
              options.map((option) => (
                <FieldGroup className="mx-auto" key={option.value}>
                  <Field orientation="horizontal">
                    <Checkbox
                      id={option.value}
                      name={option.value}
                      checked={selectedValues.includes(option.value)}
                      onCheckedChange={() => handleToggle(option.value)}
                    />
                    <FieldLabel htmlFor={option.value}>{option.label}</FieldLabel>
                  </Field>
                </FieldGroup>
              ))
            ) : (
              <>{children}</>
            )}
          </div>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  );
};
