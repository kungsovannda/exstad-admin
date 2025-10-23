import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Province } from "@/types/province";
import { MoreHorizontal } from "lucide-react";
import React, { useState } from "react";
import { ViewProvince } from "../ViewProvince";

export default function ProvinceCellAction({ data }: { data: Province }) {
  const [isOpenView, setIsOpenView] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setIsOpenView(true)}>
          View Details
        </DropdownMenuItem>
      </DropdownMenuContent>
      {isOpenView && (
        <ViewProvince
          onOpenChange={setIsOpenView}
          open={isOpenView}
          province={data}
        />
      )}
    </DropdownMenu>
  );
}
