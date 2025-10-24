"use client";

import { useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { updatePreference } from "../preferenceSlice";
import { Preference } from "@/types/preference";
import { toast } from "sonner";

// Famous English + Khmer fonts (~20)
const FONT_OPTIONS = [
  "Roboto",
  "Inter",
  "Noto Sans",
  "Noto Serif",
  "Khmer OS System",
  "Khmer OS",
  "Khmer OS Battambang",
  "Khmer OS Bokor",
  "Khmer OS Muol Light",
  "Khmer OS Muol",
  "Khmer OS Siemreap",
  "Khmer OS Fasthand",
  "Hanuman",
  "Kantumruy Pro",
  "Moul",
  "Freehand",
  "Content",
  "Siemreap",
  "Battambang",
  "Bayon",
];

export default function ExportSetting() {
  const preference = useAppSelector((state) => state.preference);
  const [selectedFont, setSelectedFont] = useState(preference.export?.font);

  const dispatch = useAppDispatch();
  const handleSave = () => {
    const newPreference: Preference = {
      export: {
        font: selectedFont,
      },
    };
    dispatch(updatePreference(newPreference));
    toast.success("New preference has been saved");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Export Setting</CardTitle>
      </CardHeader>
      <CardDescription className="px-6">
        This is the place that you can modify the setting when exporting to
        Excel.
      </CardDescription>
      <CardContent className="pt-4 flex flex-col space-y-4">
        <div className="flex flex-col space-y-2">
          <Label>Font</Label>
          <Select
            value={selectedFont}
            onValueChange={(v) => setSelectedFont(v)}
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Select a font" />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              <Command>
                <CommandInput placeholder="Search fonts..." className="h-9" />
                <CommandList>
                  <ScrollArea className="h-72">
                    <CommandEmpty>No font found.</CommandEmpty>
                    <CommandGroup>
                      {FONT_OPTIONS.map((font) => (
                        <CommandItem
                          key={font}
                          value={font}
                          className="cursor-pointer"
                        >
                          <SelectItem className="h-6" value={font}>
                            {font}
                          </SelectItem>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </ScrollArea>
                </CommandList>
              </Command>
            </SelectContent>
          </Select>
        </div>
        <CardAction className="w-full flex justify-end items-center ">
          <Button onClick={handleSave} variant={"secondary"} size={"sm"}>
            Save Change
          </Button>
        </CardAction>
      </CardContent>
    </Card>
  );
}
