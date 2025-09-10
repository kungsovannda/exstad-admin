"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { FiMoon } from "react-icons/fi";
import { FiSun } from "react-icons/fi";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title="Toggle theme"
      className="relative inline-flex items-center justify-center rounded-full border border-transparent"
    >
      <FiSun className="text-foreground hover:text-foreground/70 h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <FiMoon className="text-foreground hover:text-foreground/70 absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
