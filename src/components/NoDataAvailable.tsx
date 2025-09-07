import { Inbox } from "lucide-react";
import React from "react";

export default function NoDataAvailable({ title }: { title?: string }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center py-10 text-muted-foreground/60 gap-2">
      <Inbox size={44} stroke="currentColor" className="opacity-50" />
      <span>{title || "No Data Available"}</span>
    </div>
  );
}
