"use client";
import { Heading } from "@/components/Heading";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { DefaultTableModel } from "@/components/table/default-table-model";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CreateUserModal from "@/features/user/components/CreateUserModal";
import { userColumns } from "@/features/user/components/table/column";
import { useGetNotScholarUsersQuery } from "@/features/user/userApi";
import { useState } from "react";
import { FiPlus } from "react-icons/fi";

export default function UserPage() {
  const { data: users, isLoading } = useGetNotScholarUsersQuery();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  return (
    <div className="p-6 space-y-6 min-h-screen h-fit">
      <div className="flex justify-between items-center  gap-10">
        <Heading
          title="User Management"
          description="This where you can manage all users such as Admin and Instructors"
        />
        <Button variant="outline" className="flex items-center gap-2.5">
          <FiPlus />
          <span onClick={() => setIsCreateOpen(true)}>Add User</span>
        </Button>
      </div>
      <Card className="flex flex-col space-y-4 rounded-lg shadow-sm">
        <CardHeader className="items-center pb-2">
          <CardTitle>User Overview</CardTitle>
          <CardDescription>View and manage user information</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <DataTableSkeleton columnCount={5} />
          ) : (
            <DefaultTableModel
              columns={userColumns}
              totalItems={Array.isArray(users) ? users.length : 0}
              data={Array.isArray(users) ? users : []}
            />
          )}
        </CardContent>
      </Card>
      {isCreateOpen && (
        <CreateUserModal open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      )}
    </div>
  );
}
