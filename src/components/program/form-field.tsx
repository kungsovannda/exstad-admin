  'use client'

  import React,{useState} from "react";
  import { Label } from "@/components/ui/label";
  import { Input } from "@/components/ui/input";
  import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
  import { Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover";
  import { Calendar } from "@/components/ui/calendar";
  import { Button } from "@/components/ui/button"
  import { Calendar as CalendarIcon } from "lucide-react"
  import { format } from "date-fns";
  // import GradientColorInput from "@/app/color-picker/page";

  type Option = {
    value: string;
    label: string;
  };

  type FormFieldProps = {
    id: string;
    label?: string;
    type?: "text" | "email" | "select" | "textarea"|"number" | "date"|"file"| "color";
    placeholder?: string; 
    options?: Option[]; // for select type
    rows?: number; // for textarea height
  };


  export function FormField({
    id,
    label,
    type = "text",
    placeholder = "",
    options = [],
    rows = 4,
  }: FormFieldProps) {
      const [date, setDate] = useState<Date | undefined>();
    return (
      <div className="grid w-full items-center gap-3">
        <Label htmlFor={id}>{label}</Label>

        {type === "select" ? (
          <Select>
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
        ) : type === "color" ? (   // 👈 added branch
    <Input type="color" id={id} placeholder={placeholder} />
  ):
        type === "textarea" ? (
          <textarea
            id={id}
            placeholder={placeholder}
            rows={rows}
            className="w-full border border-border rounded-md px-3 py-2 text-sm"
          />
        ) 
        
        : type === "date" ? (
        <div className="grid w-full gap-2">

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
            onSelect={setDate}
            captionLayout="dropdown"
            className="rounded-m  d border"
          />
        </PopoverContent>
      </Popover>
    </div>
        ) :  (
          <Input type={type} id={id} placeholder={placeholder} />
        ) 
        }

      </div>
    );
  }
