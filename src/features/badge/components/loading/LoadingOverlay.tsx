"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 rounded-md  p-6 ">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    </div>
  );
}