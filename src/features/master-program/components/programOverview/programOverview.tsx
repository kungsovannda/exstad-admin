import { useMemo, useState } from "react";
import {
  ProgramOverviewsPayload,
  useGetAllProgramOverviewQuery,
  useUpdateProgramOverviewMutation,
} from "./programOverviewApi";
import { programOverviewsPayload, programOverviewType } from "@/types/program";
import ProgramOverviewFormModal, {
  ProgramOverviewFormValue,
} from "./programOverview-modal";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FiPlus } from "react-icons/fi";
import { SquarePen, Trash } from "lucide-react";
import DeleteModal from "@/components/program/opening-program/activity/delete-modal-component";
import { SectionSkeleton } from "../section-skeleton";

type Props = { programUuid: string };

export default function ProgramOverviewAdmin({ programUuid }: Props) {
  const {
    data: programOverviews = [],
    isLoading,
    isError,
  } = useGetAllProgramOverviewQuery(programUuid, {
    refetchOnMountOrArgChange: true,
  });

  const [putProgramOverview] = useUpdateProgramOverviewMutation();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<programOverviewType | null>(
    null
  );
  const [deleteTarget, setDeleteTarget] = useState<programOverviewType | null>(
    null
  );

  const programOverviewwithUuid = useMemo(
    () =>
      (programOverviews ?? []).map((p) => ({
        ...p,
        uuid: crypto.randomUUID(),
      })),
    [programOverviews]
  );

  if (isLoading) return <SectionSkeleton count={4}/>;
  if (isError)
    return (
      <div className="text-destructive">
        Failed to load Program Overviews...
      </div>
    );

  const handleSaveProgramOverview = async (
    data: ProgramOverviewFormValue,
    target?: programOverviewType
  ) => {
    try {
      const safeProgramOverviews = programOverviews ?? [];
      let newProgramOverviews: programOverviewType[];

      if (target) {
        newProgramOverviews = safeProgramOverviews.map((p) =>
          p.title === target.title && p.description === target.description
            ? { ...p, ...data }
            : p
        );
      } else {
        newProgramOverviews = [...safeProgramOverviews, { ...data }];
      }

      const payload: ProgramOverviewsPayload[] = newProgramOverviews.map(
        ({ title, description }) => ({
          title,
          description,
        })
      );

      await putProgramOverview({
        programUuid,
        programOverviews: payload,
      }).unwrap();
      toast.success(
        target ? "Program Overview updated!" : "Program Overview added!"
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to save: ${message || err}`);
    }
  };

  const handleDeleteProgramOverview = async (target: programOverviewType) => {
    try {
      const safeProgramOverviews = programOverviews ?? [];
      const newProgramOverviews = safeProgramOverviews.filter(
        (p) =>
          !(p.title === target.title && p.description === target.description)
      );
      const payload: programOverviewsPayload[] = newProgramOverviews.map(
        ({ title, description }) => ({
          title,
          description,
        })
      );

      await putProgramOverview({
        programUuid,
        programOverviews: payload,
      }).unwrap();
      toast.success(`Program Overview "${target.title}" deleted!`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to delete: ${message || err}`);
    }
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="flex justify-between items-center">
        <h2 className="text-[18px] font-bold text-foreground">
          Program Overviews
        </h2>
        <ProgramOverviewFormModal
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          onSubmitProgramOverview={async (data) => {
            await handleSaveProgramOverview(data);
            setIsCreateOpen(false);
          }}
          trigger={
            <Button>
              <FiPlus />
              <span className="font-bold cursor-pointer">Add Program Overviews</span>
            </Button>
          }
        />
      </div>

      {/* Program Overview List */}
      {programOverviewwithUuid.length === 0 ? (
        <div>No Program Overview yet. Add one to get started!</div>
      ) : (
        programOverviewwithUuid.map((p) => (
          <div
            key={p.uuid}
            className="flex justify-between items-center bg-accent rounded-sm p-4"
          >
            <div className="flex flex-col">
              <span className="text-[16px] font-semibold text-foreground">
                {p.title} - {p.title}
              </span>
              <span className="text-[12px] text-muted-foreground">
                {p.description}
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <Trash
                size={16}
                className="text-destructive cursor-pointer"
                onClick={() => setDeleteTarget(p)}
              />
              <ProgramOverviewFormModal
                open={
                  !!editTarget &&
                  editTarget.title === p.title &&
                  editTarget.description === p.description
                }
                onOpenChange={(open) => !open && setEditTarget(null)}
                initialData={editTarget || undefined}
                onSubmitProgramOverview={async (data) => {
                  if (editTarget)
                    await handleSaveProgramOverview(data, editTarget);
                  setEditTarget(null);
                }}
                trigger={
                  <SquarePen
                    size={16}
                    className="text-primary-hover cursor-pointer"
                    onClick={() => setEditTarget(p)}
                  />
                }
              />
            </div>
          </div>
        ))
      )}

      {/* Delete Modal */}
      <DeleteModal
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        itemName={deleteTarget?.title || ""}
        onConfirm={async () => {
          if (deleteTarget) await handleDeleteProgramOverview(deleteTarget);
          setDeleteTarget(null); // close after delete
        }}
      />
    </div>
  );
}
