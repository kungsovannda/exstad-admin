"use client";
import { Heading } from "@/components/Heading";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useGetAllAchievementsQuery } from "@/features/achievement/achievementApi";
import CreateAchievementModal from "@/features/achievement/components/CreateAchievementModal";
import { achievementColumns } from "@/features/achievement/components/table/columns";
import { AchievementTable } from "@/features/achievement/components/table/data-table";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function AchievementPage() {
  const [isCrateShow, setIsCreateShow] = useState(false);
  const { data: achievements, isLoading } = useGetAllAchievementsQuery();
  return (
    <div className="p-6 flex flex-1 flex-col space-y-4">
      <div className="flex items-center justify-between">
        <Heading
          title="Achievement Management"
          description="This is where you can see all achievements, create and modify them"
        />
        <Button onClick={() => setIsCreateShow(true)} variant="outline">
          <Plus />
          Create Achievement
        </Button>
      </div>
      <Separator />
      {isLoading ? (
        <DataTableSkeleton columnCount={5} />
      ) : (
        <AchievementTable
          data={Array.isArray(achievements) ? achievements : []}
          columns={achievementColumns}
          totalItems={Array.isArray(achievements) ? achievements.length : 0}
        />
      )}
      {isCrateShow && (
        <CreateAchievementModal
          open={isCrateShow}
          onOpenChange={setIsCreateShow}
        />
      )}
    </div>
  );
}
