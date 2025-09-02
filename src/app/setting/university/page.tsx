"use client";
import { useDeleteUniversity, useUniversities } from "@/hooks/university";
import DataTable from "./data-table";
import { columns } from "./column";
import Loader from "@/app/loading";
import { useState } from "react";
import { University } from "@/types/university";
import { ViewAndUpdateUniversity } from "@/components/university/ViewAndUpdateUniversity";
import ModalDelete from "@/components/modal/ModalDelete";
import { Heading } from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { CreateUniversity } from "@/components/university/CreateUniversity";
import { DataTableSkeleton } from "@/components/ui/data-table-skeleton";

export default function UniversityPage() {
  const { data, isLoading, error } = useUniversities();
  const [selectedUniversity, setSelectedUniversity] =
    useState<University | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);

  const mutation = useDeleteUniversity();

  const handleOnDelete = () => {
    const uuid = selectedUniversity?.uuid;
    if (!uuid) return;
    mutation.mutate(uuid);
    if (mutation.isError) {
      console.log(mutation.error);
    }
    toast.promise(mutation.mutateAsync(uuid), {
      loading: "Deleting...",
      success: () => {
        return `${selectedUniversity.englishName} has been deleted`;
      },
      error: () => {
        return `Cannot delete ${selectedUniversity.englishName}`;
      },
    });
    setIsModalDeleteOpen(false);
  };
  if (error) return <div>Error: {error.message}</div>;
  return (
    <>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-center justify-between">
          <Heading
            title="University"
            description="Manage universities (Server side table functionalities.)"
          />
          <Button
            onClick={() => setIsModalCreateOpen(true)}
            className={"text-xs md:text-sm"}
          >
            <IconPlus className="mr-2 h-4 w-4" /> Add New
          </Button>
        </div>
        <Separator />
        {isLoading ? (
          <DataTableSkeleton columnCount={5} />
        ) : (
          <DataTable
            columns={columns({
              onView: (u) => {
                setSelectedUniversity(u);
                setIsDialogOpen(true);
              },
              onDelete: (u) => {
                setSelectedUniversity(u);
                setIsModalDeleteOpen(true);
              },
            })}
            data={data!}
          />
        )}
      </div>

      <ViewAndUpdateUniversity
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        university={selectedUniversity}
      />

      <ModalDelete
        open={isModalDeleteOpen}
        onOpenChange={setIsModalDeleteOpen}
        title="Delete University"
        description={`Are you sure you want to delete ${selectedUniversity?.englishName}?`}
        onDelete={handleOnDelete}
      />

      <CreateUniversity
        open={isModalCreateOpen}
        onOpenChange={setIsModalCreateOpen}
      />
    </>
  );
}
