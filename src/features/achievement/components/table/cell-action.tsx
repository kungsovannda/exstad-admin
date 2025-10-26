import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Achievement } from "@/types/achievement";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import ViewAndUpdateAchievement from "../ViewAndUpdateAchievement";

export default function AchievementCellAction({ data }: { data: Achievement }) {
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
        <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
      </DropdownMenuContent>

      {isViewOpen && (
        <ViewAndUpdateAchievement
          open={isViewOpen}
          onOpenChange={setIsViewOpen}
          achievement={data}
        />
      )}
    </DropdownMenu>
  );
}
