"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

type Option = { value: string; label: string };

type FormFieldProps = {
  id: string;
  label?: string;
  type?: "text" | "number" | "textarea" |"select" | "email" | "date" | "color";
  placeholder?: string;
  options?: Option[];
  rows?: number;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

export function FormField({
  id,
  label,
  type = "text",
  placeholder = "",
  options = [],
  rows = 4,
  value,
  onChange,
}: FormFieldProps) {
  const [date, setDate] = useState<Date | undefined>();

  return (
    <div className="grid w-full items-center gap-2">
      {label && <Label htmlFor={id}>{label}</Label>}

      {type === "select" ? (
        <Select
          value={value as string}
          onValueChange={(val) => onChange?.({ target: { id, value: val } } as React.ChangeEvent<HTMLInputElement>)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={placeholder || "Select..."} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      ) : type === "textarea" ? (
        <textarea
          id={id}
          placeholder={placeholder}
          rows={rows}
          className="w-full border border-border rounded-md px-3 py-2 text-sm"
          value={value as string}
          onChange={onChange}
        />
      ) : type === "date" ? (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              data-empty={!date}
              className="w-full justify-between text-left font-normal"
            >
              <span>{date ? format(date, "PPP") : placeholder}</span>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => {
                setDate(d ?? undefined);
                onChange?.({ target: { id, value: d?.toISOString() || "" } } as React.ChangeEvent<HTMLInputElement>);
              }}
              className="rounded-md border"
            />
          </PopoverContent>
        </Popover>
      ) : (
        <Input id={id} type={type} placeholder={placeholder} value={value as string | number} onChange={onChange} />
      )}
    </div>
  );
}
