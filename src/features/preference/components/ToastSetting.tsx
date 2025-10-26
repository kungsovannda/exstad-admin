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
  { value: 300, label: "300ms" },
  { value: 500, label: "500ms" },
  { value: 1000, label: "1 second" },
  { value: 2000, label: "2 seconds" },
  { value: 3000, label: "3 seconds" },
  { value: 5000, label: "5 seconds" },
  { value: 7000, label: "7 seconds" },
  { value: 10000, label: "10 seconds" },
];

const POSITION_OPTIONS: {
  value:
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "top-center"
    | "bottom-center";
  label: string;
}[] = [
  { value: "top-left", label: "Top Left" },
  { value: "top-center", label: "Top Center" },
  { value: "top-right", label: "Top Right" },
  { value: "bottom-left", label: "Bottom Left" },
  { value: "bottom-center", label: "Bottom Center" },
  { value: "bottom-right", label: "Bottom Right" },
];

export default function ToastSetting() {
  const preference = useAppSelector((state) => state.preference.toast);
  const [toastExpanded, setToastExpanded] = useState(
    preference?.expand ?? false
  );
  const [toastRich, setToastRich] = useState(preference?.richColor ?? false);
  const [toastCloseButton, setToastCloseButton] = useState(
    preference?.closeButton ?? false
  );
  const [toastDuration, setToastDuration] = useState(
    preference?.duration ?? 3000
  );
  const [toastPosition, setToastPosition] = useState<
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "top-center"
    | "bottom-center"
  >(preference?.position ?? "top-right");

  const dispatch = useAppDispatch();
  const handleSave = () => {
    const toastPreference = {
      toast: {
        expand: toastExpanded,
        richColor: toastRich,
        closeButton: toastCloseButton,
        duration: toastDuration,
        position: toastPosition,
      },
    };
    dispatch(updatePreference(toastPreference));
    toast.success("Toast preferences have been saved");
    handleOnChange();
  };

  const handleOnChange = () => {
    let i = 0;
    do {
      toast.info("This is the custom toast");
      i++;
    } while (i < 2);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Toast Settings</CardTitle>
      </CardHeader>
      <CardDescription className="px-6">
        Customize your toast notification behavior including expansion state and
        display duration.
      </CardDescription>
      <CardContent className="pt-4 w-full flex flex-col space-y-6">
        {/* Toast Expanded */}
        <div className="flex items-center justify-between space-x-4 p-4 border rounded-lg">
          <div className="flex-1 space-y-1">
            <Label htmlFor="toast-expanded" className="text-sm font-medium">
              Toast Expanded
            </Label>
            <p className="text-sm text-muted-foreground">
              Toast notifications will be expanded when they appear
            </p>
          </div>
          <Switch
            id="toast-expanded"
            checked={toastExpanded}
            onCheckedChange={setToastExpanded}
          />
        </div>

        {/* Toast Rich Color */}
        <div className="flex items-center justify-between space-x-4 p-4 border rounded-lg">
          <div className="flex-1 space-y-1">
            <Label htmlFor="toast-rich-color" className="text-sm font-medium">
              Toast Rich Color
            </Label>
            <p className="text-sm text-muted-foreground">
              Toast notifications will use rich colors for different types
            </p>
          </div>
          <Switch
            id="toast-rich-color"
            checked={toastRich}
            onCheckedChange={setToastRich}
          />
        </div>

        {/* Toast Close Button */}
        <div className="flex items-center justify-between space-x-4 p-4 border rounded-lg">
          <div className="flex-1 space-y-1">
            <Label htmlFor="toast-close-button" className="text-sm font-medium">
              Show Close Button
            </Label>
            <p className="text-sm text-muted-foreground">
              Display a close button on toast notifications
            </p>
          </div>
          <Switch
            id="toast-close-button"
            checked={toastCloseButton}
            onCheckedChange={setToastCloseButton}
          />
        </div>

        {/* Toast Duration */}
        <div className="flex flex-col space-y-3 p-4 border rounded-lg">
          <div className="space-y-1">
            <Label htmlFor="toast-duration" className="text-sm font-medium">
              Toast Duration
            </Label>
            <p className="text-sm text-muted-foreground">
              Set how long toast notifications remain visible before
              auto-closing
            </p>
          </div>
          <Select
            value={toastDuration.toString()}
            onValueChange={(v) => setToastDuration(Number(v))}
          >
            <SelectTrigger id="toast-duration" className="h-11">
              <SelectValue placeholder="Select duration" />
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

        {/* Toast Position */}
        <div className="flex flex-col space-y-3 p-4 border rounded-lg">
          <div className="space-y-1">
            <Label htmlFor="toast-position" className="text-sm font-medium">
              Toast Position
            </Label>
            <p className="text-sm text-muted-foreground">
              Set where toast notifications appear on the screen
            </p>
          </div>
          <Select
            value={toastPosition}
            onValueChange={(v) =>
              setToastPosition(
                v as
                  | "top-left"
                  | "top-right"
                  | "bottom-left"
                  | "bottom-right"
                  | "top-center"
                  | "bottom-center"
              )
            }
          >
            <SelectTrigger id="toast-position" className="h-11">
              <SelectValue placeholder="Select position" />
            </SelectTrigger>
            <SelectContent>
              {POSITION_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full flex justify-end items-center pt-2">
          <Button onClick={handleSave} variant="secondary" size="sm">
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
