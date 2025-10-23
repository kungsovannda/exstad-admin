"use client";

import type { Column } from "@tanstack/react-table";
import { CheckIcon, PlusCircle } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface DataTableBooleanFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
}

export function DataTableBooleanFilter<TData, TValue>({
  column,
  title,
}: DataTableBooleanFilterProps<TData, TValue>) {
  const [open, setOpen] = React.useState(false);
  const filterValue = column?.getFilterValue();

  const onSelect = React.useCallback(
    (value: string) => {
      if (!column) return;

      if (value === "all") {
        column.setFilterValue(undefined);
      } else {
        column.setFilterValue(value === "true");
      }
      setOpen(false);
    },
    [column]
  );

  const getLabel = () => {
    if (filterValue === true) return "True";
    if (filterValue === false) return "False";
    return null;
  };

  const label = getLabel();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="border-dashed">
          <PlusCircle />
          {title}
          {label && (
            <>
              <Separator
                orientation="vertical"
                className="mx-0.5 data-[orientation=vertical]:h-4"
              />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal"
              >
                {label}
              </Badge>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[12.5rem] p-0" align="start">
        <Command>
          <CommandList className="max-h-full">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              <CommandItem onSelect={() => onSelect("all")}>
                <div
                  className={cn(
                    "border-primary flex size-4 items-center justify-center rounded-sm border",
                    filterValue === undefined
                      ? "bg-primary"
                      : "opacity-50 [&_svg]:invisible"
                  )}
                >
                  <CheckIcon />
                </div>
                <span>All</span>
              </CommandItem>
              <CommandItem onSelect={() => onSelect("true")}>
                <div
                  className={cn(
                    "border-primary flex size-4 items-center justify-center rounded-sm border",
                    filterValue === true
                      ? "bg-primary"
                      : "opacity-50 [&_svg]:invisible"
                  )}
                >
                  <CheckIcon />
                </div>
                <span>True</span>
              </CommandItem>
              <CommandItem onSelect={() => onSelect("false")}>
                <div
                  className={cn(
                    "border-primary flex size-4 items-center justify-center rounded-sm border",
                    filterValue === false
                      ? "bg-primary"
                      : "opacity-50 [&_svg]:invisible"
                  )}
                >
                  <CheckIcon />
                </div>
                <span>False</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
