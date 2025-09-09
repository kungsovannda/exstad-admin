"use client";

import { Heading } from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import VerificationDataTable from "./data-table";
import { badges } from "@/data/badges";
import { columns } from "./columns";
import { CreateVerificationBadge } from "@/components/scholar/CreateVerificationBadge";

export default function VerificationBadge() {
  const [isCreateShow, setIsCreateShow] = useState(false);
  return (
    <div className="p-6 flex flex-1 flex-col space-y-4">
      <div className="flex items-center justify-between">
        <Heading
          title="Verification Badge"
          description="Manage your verification badge"
        />
        <Button onClick={() => setIsCreateShow(true)} variant="outline">
          <Plus />
          Create New Badge
        </Button>
      </div>
      <Separator />
      <VerificationDataTable
        data={badges}
        columns={columns}
        totalItems={badges.length}
      />
      {isCreateShow && (
        <CreateVerificationBadge
          open={isCreateShow}
          onOpenChange={setIsCreateShow}
        />
      )}
    </div>
  );
}
