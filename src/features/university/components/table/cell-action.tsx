import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { University } from "@/types/university";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { ViewAndUpdateUniversity } from "../ViewAndUpdateUniversity";

export default function UniversityCellAction({ data }: { data: University }) {
  const [isViewOpen, setIsViewOpen] = useState(false);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setIsViewOpen(true)}>
          View & Update
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive">
          Delete university
        </DropdownMenuItem>
      </DropdownMenuContent>
      {isViewOpen && (
        <ViewAndUpdateUniversity
          open={isViewOpen}
          onOpenChange={setIsViewOpen}
          university={data}
        />
      )}
    </DropdownMenu>
  );
}
