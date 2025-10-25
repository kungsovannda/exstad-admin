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
import { Input } from "@/components/ui/input";
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
  const [headerFont, setHeaderFont] = useState(
    preference.export?.header?.font || "Kantumruy Pro"
  );
  const [headerSize, setHeaderSize] = useState(
    preference.export?.header?.size || 12
  );
  const [contentFont, setContentFont] = useState(
    preference.export?.content?.font || "Kantumruy Pro"
  );
  const [contentSize, setContentSize] = useState(
    preference.export?.content?.size || 11
  );

  const dispatch = useAppDispatch();

  const handleSave = () => {
    const newPreference: Preference = {
      export: {
        header: {
          font: headerFont,
          size: headerSize,
        },
        content: {
          font: contentFont,
          size: contentSize,
        },
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
      <CardContent className="pt-4 w-full flex flex-col space-y-4">
        <div className="flex w-full gap-4">
          {/* Left Column - Header */}
          <div className="flex flex-col w-1/2 space-y-4">
            <div className="flex flex-col space-y-2">
              <Label>Header Font</Label>
              <Select
                value={headerFont}
                onValueChange={(v) => setHeaderFont(v)}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select a font" />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  <Command>
                    <CommandInput
                      placeholder="Search fonts..."
                      className="h-9"
                    />
                    <CommandList>
                      <ScrollArea className="h-72">
                        <CommandEmpty>No font found.</CommandEmpty>
                        <CommandGroup>
                          {FONT_OPTIONS.map((font) => (
                            <CommandItem
                              key={font}
                              value={font}
                              className="cursor-pointer"
                              onSelect={() => setHeaderFont(font)}
                            >
                              <SelectItem value={font}>{font}</SelectItem>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </ScrollArea>
                    </CommandList>
                  </Command>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-2">
              <Label>Header Size</Label>
              <Input
                type="number"
                value={headerSize}
                onChange={(e) => setHeaderSize(Number(e.target.value))}
                min={8}
                max={72}
                className="h-10"
              />
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="flex flex-col w-1/2 space-y-4">
            <div className="flex flex-col space-y-2">
              <Label>Content Font</Label>
              <Select
                value={contentFont}
                onValueChange={(v) => setContentFont(v)}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select a font" />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  <Command>
                    <CommandInput
                      placeholder="Search fonts..."
                      className="h-9"
                    />
                    <CommandList>
                      <ScrollArea className="h-72">
                        <CommandEmpty>No font found.</CommandEmpty>
                        <CommandGroup>
                          {FONT_OPTIONS.map((font) => (
                            <CommandItem
                              key={font}
                              value={font}
                              className="cursor-pointer"
                              onSelect={() => setContentFont(font)}
                            >
                              <SelectItem value={font}>{font}</SelectItem>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </ScrollArea>
                    </CommandList>
                  </Command>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-2">
              <Label>Content Size</Label>
              <Input
                type="number"
                value={contentSize}
                onChange={(e) => setContentSize(Number(e.target.value))}
                min={8}
                max={72}
                className="h-10"
              />
            </div>
          </div>
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
