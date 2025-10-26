"use client";

import { useState } from "react";
import {
  Card,
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
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { updatePreference } from "../preferenceSlice";

const DELAY_OPTIONS = [
  { value: 0, label: "No delay" },
  { value: 300, label: "300ms" },
  { value: 500, label: "500ms" },
  { value: 1000, label: "1 second" },
  { value: 2000, label: "2 seconds" },
  { value: 3000, label: "3 seconds" },
  { value: 5000, label: "5 seconds" },
  { value: 7000, label: "7 seconds" },
  { value: 10000, label: "10 seconds" },
];

export default function SidebarSetting() {
  const preference = useAppSelector((state) => state.preference.sidebar);
  const [parentOpenByDefault, setParentOpenByDefault] = useState(
    preference?.parent?.defaultOpen ?? true
  );
  const [childCloseDelay, setChildCloseDelay] = useState(
    preference?.child?.delay ?? 3000
  );

  const dispatch = useAppDispatch();
  const handleSave = () => {
    const sidebarPreference = {
      sidebar: {
        parent: { defaultOpen: parentOpenByDefault },
        child: { delay: childCloseDelay },
      },
    };
    dispatch(updatePreference(sidebarPreference));
    toast.success("Sidebar preferences have been saved");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sidebar Settings</CardTitle>
      </CardHeader>
      <CardDescription className="px-6">
        Customize your sidebar behavior including default state and timing
        preferences.
      </CardDescription>
      <CardContent className="pt-4 w-full flex flex-col space-y-6">
        {/* Parent Sidebar Default State */}
        <div className="flex items-center justify-between space-x-4 p-4 border rounded-lg">
          <div className="flex-1 space-y-1">
            <Label htmlFor="parent-open" className="text-sm font-medium">
              Open Parent Sidebar by Default
            </Label>
            <p className="text-sm text-muted-foreground">
              The parent sidebar will be expanded when you open the application
            </p>
          </div>
          <Switch
            id="parent-open"
            checked={parentOpenByDefault}
            onCheckedChange={setParentOpenByDefault}
          />
        </div>

        {/* Child Sidebar Close Delay */}
        <div className="flex flex-col space-y-3 p-4 border rounded-lg">
          <div className="space-y-1">
            <Label htmlFor="close-delay" className="text-sm font-medium">
              Child Sidebar Close Delay
            </Label>
            <p className="text-sm text-muted-foreground">
              Set the delay before the child sidebar automatically closes
            </p>
          </div>
          <Select
            value={childCloseDelay.toString()}
            onValueChange={(v) => setChildCloseDelay(Number(v))}
          >
            <SelectTrigger id="close-delay" className="h-11">
              <SelectValue placeholder="Select delay duration" />
            </SelectTrigger>
            <SelectContent>
              {DELAY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Save Button */}
        <div className="w-full flex justify-end items-center pt-2">
          <Button onClick={handleSave} variant="secondary" size="sm">
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
