"use client";

import React, { useCallback, useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { updatePreference } from "../preferenceSlice";
import { Preference } from "@/types/preference";
import { toast } from "sonner";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useThemeConfig } from "@/components/active-theme";

const THEME_OPTIONS = [
  {
    mode: "light",
    label: "Light",
    icon: Sun,
    preview: "bg-gradient-to-br from-gray-50 to-gray-100",
    border: "border-gray-200",
  },
  {
    mode: "dark",
    label: "Dark",
    icon: Moon,
    preview: "bg-gradient-to-br from-gray-900 to-gray-800",
    border: "border-gray-700",
  },
  {
    mode: "system",
    label: "System",
    icon: Monitor,
    preview: "bg-gradient-to-br from-gray-400 to-gray-600",
    border: "border-gray-500",
  },
];

const VARIANT_OPTIONS = [
  {
    variant: "default",
    label: "Default",
    preview: "bg-gradient-to-br from-neutral-600 to-neutral-700",
    border: "border-neutral-500",
  },
  {
    variant: "blue",
    label: "Blue",
    preview: "bg-gradient-to-br from-blue-600 to-blue-700",
    border: "border-blue-500",
  },
  {
    variant: "green",
    label: "Green",
    preview: "bg-gradient-to-br from-lime-600 to-lime-700",
    border: "border-lime-500",
  },
  {
    variant: "amber",
    label: "Amber",
    preview: "bg-gradient-to-br from-amber-600 to-amber-700",
    border: "border-amber-500",
  },
  {
    variant: "default-scaled",
    label: "Default Scaled",
    preview: "bg-gradient-to-br from-neutral-600 to-neutral-700",
    border: "border-neutral-500",
  },
  {
    variant: "blue-scaled",
    label: "Blue Scaled",
    preview: "bg-gradient-to-br from-blue-600 to-blue-700",
    border: "border-blue-500",
  },
  {
    variant: "mono-scaled",
    label: "Mono",
    preview: "bg-gradient-to-br from-neutral-500 to-neutral-600",
    border: "border-neutral-400",
  },
];

export default function ThemeSetting() {
  const preference = useAppSelector((state) => state.preference);
  const { setTheme, resolvedTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(
    preference.theme?.mode || "system"
  );
  const [selectedVariant, setSelectedVariant] = useState(
    preference.theme?.variant || "default"
  );
  const { activeTheme, setActiveTheme } = useThemeConfig();

  const handleThemeToggle = useCallback(
    (mode: string, e?: React.MouseEvent) => {
      const newMode = mode;
      const root = document.documentElement;

      if (!document.startViewTransition) {
        setTheme(newMode);
        return;
      }

      // Set coordinates from the click event
      if (e) {
        root.style.setProperty("--x", `${e.clientX}px`);
        root.style.setProperty("--y", `${e.clientY}px`);
      }

      document.startViewTransition(() => {
        setTheme(newMode);
      });
    },
    [setTheme]
  );

  const dispatch = useAppDispatch();

  const handleSave = () => {
    const newPreference: Preference = {
      ...preference,
      theme: {
        mode: selectedTheme,
        variant: selectedVariant,
      },
    };
    dispatch(updatePreference(newPreference));
    toast.success("Theme preference has been saved");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
      </CardHeader>
      <CardDescription className="px-6">
        Customize the look of your workspace. Choose a theme that suits your
        preferences.
      </CardDescription>
      <CardContent className="pt-4 w-full flex flex-col space-y-4">
        <div className="flex flex-col space-y-2">
          <Label>Interface Theme</Label>
          <div className="grid grid-cols-3 gap-4">
            {THEME_OPTIONS.map((theme) => {
              const Icon = theme.icon;
              const isSelected = selectedTheme === theme.mode;
              return (
                <button
                  key={theme.mode}
                  onClick={(e) => {
                    setSelectedTheme(theme.mode);
                    handleThemeToggle(theme.mode, e);
                  }}
                  className={`relative flex flex-col items-center gap-3 p-4 rounded-lg border-2 transition-all hover:border-primary/50 ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  {/* Preview Box */}
                  <div
                    className={`w-full h-20 rounded-md border-2 ${theme.border} ${theme.preview} flex items-center justify-center relative overflow-hidden`}
                  >
                    {/* Simulated content bars */}
                    <div className="absolute inset-0 p-2 flex flex-col gap-1">
                      <div className="h-2 w-3/4 bg-white/20 dark:bg-black/20 rounded"></div>
                      <div className="h-2 w-1/2 bg-white/20 dark:bg-black/20 rounded"></div>
                      <div className="h-2 w-2/3 bg-white/20 dark:bg-black/20 rounded"></div>
                    </div>
                    <Icon
                      className={`w-6 h-6 z-10 ${
                        theme.mode === "light"
                          ? "text-gray-700"
                          : theme.mode === "dark"
                          ? "text-gray-200"
                          : "text-gray-300"
                      }`}
                    />
                  </div>
                  {/* Label */}
                  <span className="text-sm font-medium">{theme.label}</span>
                  {/* Selected Indicator */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <Label>Color Variant</Label>
          <div className="grid grid-cols-4 mb-4 gap-4">
            {VARIANT_OPTIONS.filter((d) => !d.variant.includes("scale")).map(
              (variant) => {
                const isSelected = selectedVariant === variant.variant;
                return (
                  <button
                    key={variant.variant}
                    onClick={() => {
                      setSelectedVariant(variant.variant);
                      setActiveTheme(variant.variant);
                    }}
                    className={`relative flex flex-col items-center gap-3 p-4 rounded-lg border-2 transition-all hover:border-primary/50 ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <div
                      className={`w-full h-16 rounded-md border-2 ${variant.border} ${variant.preview} flex items-center justify-center relative overflow-hidden`}
                    >
                      {/* Color swatch */}
                      <div className="absolute inset-0 p-2 flex gap-1">
                        <div className="flex-1 bg-white/10 rounded"></div>
                        <div className="flex-1 bg-white/20 rounded"></div>
                        <div className="flex-1 bg-white/30 rounded"></div>
                      </div>
                    </div>
                    {/* Label */}
                    <span className="text-xs font-medium">{variant.label}</span>
                    {/* Selected Indicator */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                    )}
                  </button>
                );
              }
            )}
          </div>
          <div className="grid grid-cols-3 gap-4">
            {VARIANT_OPTIONS.filter((d) => d.variant.includes("scale")).map(
              (variant) => {
                const isSelected = selectedVariant === variant.variant;
                return (
                  <button
                    key={variant.variant}
                    onClick={() => {
                      setSelectedVariant(variant.variant);
                      setActiveTheme(variant.variant);
                    }}
                    className={`relative flex flex-col items-center gap-3 p-4 rounded-lg border-2 transition-all hover:border-primary/50 ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <div
                      className={`w-full h-16 rounded-md border-2 ${variant.border} ${variant.preview} flex items-center justify-center relative overflow-hidden`}
                    >
                      {/* Color swatch */}
                      <div className="absolute inset-0 p-2 flex gap-1">
                        <div className="flex-1 bg-white/10 rounded"></div>
                        <div className="flex-1 bg-white/20 rounded"></div>
                        <div className="flex-1 bg-white/30 rounded"></div>
                      </div>
                    </div>
                    {/* Label */}
                    <span className="text-xs font-medium">{variant.label}</span>
                    {/* Selected Indicator */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                    )}
                  </button>
                );
              }
            )}
          </div>
        </div>

        <CardAction className="w-full flex justify-end items-center pt-2">
          <Button onClick={handleSave} variant={"secondary"} size={"sm"}>
            Save Change
          </Button>
        </CardAction>
      </CardContent>
    </Card>
  );
}
