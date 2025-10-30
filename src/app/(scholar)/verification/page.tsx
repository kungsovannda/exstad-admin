"use client";

import { Heading } from "@/components/Heading";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useGetAllBadgeQuery } from "@/features/badge/badgeApi";
import { CreateVerificationBadge } from "@/features/badge/components/CreateVerificationBadge";
import { verificationColumns } from "@/features/badge/components/table/columns";
import VerificationDataTable from "@/features/badge/components/table/data-table";
import { useAuth } from "@/hooks/use-auth";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function VerificationBadge() {
  const [isCreateShow, setIsCreateShow] = useState(false);
  const { data: badges, isLoading } = useGetAllBadgeQuery();
  const { hasRole } = useAuth();
  return (
    <div className="p-6 flex flex-1 flex-col space-y-4">
      <div className="flex items-center justify-between">
        <Heading
          title="Verification Badge"
          description="Manage your verification badge"
        />
        {hasRole(["INSTRUCTOR1", "ADMIN"]) && (
          <Button onClick={() => setIsCreateShow(true)} variant="outline">
            <Plus />
            Create New Badge
          </Button>
        )}
      </div>
      <Separator />
      {isLoading ? (
        <DataTableSkeleton columnCount={5} />
      ) : (
        <VerificationDataTable
          data={Array.isArray(badges) ? badges : []}
          columns={verificationColumns}
          totalItems={Array.isArray(badges) ? badges.length : 0}
        />
      )}
      {isCreateShow && (
        <CreateVerificationBadge
          open={isCreateShow}
          onOpenChange={setIsCreateShow}
        />
      )}
    </div>
  );
}
