"use client";
import { Heading } from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { achievements } from "@/data/achievements";
import CreateAchievement from "@/features/achievement/components/CreateAchievement";
import { achievementColumns } from "@/features/achievement/components/table/columns";
import { AchievementTable } from "@/features/achievement/components/table/data-table";
import { Plus } from "lucide-react";
import React, { useState } from "react";

export default function AchievementPage() {
  const [isCrateShow, setIsCreateShow] = useState(false);
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
      <AchievementTable
        data={achievements}
        columns={achievementColumns}
        totalItems={achievementColumns.length}
      />
      {isCrateShow && (
        <CreateAchievement open={isCrateShow} onOpenChange={setIsCreateShow} />
      )}
    </div>
  );
}
