"use client";

import React, { useState, useEffect, useMemo } from "react";
import { FiPlus } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import TechnologyFormModal, { TechnologyFormValues } from "./technologyModa";
import { toast } from "sonner";
import { SquarePen, Trash } from "lucide-react";
import { SectionSkeleton } from "../section-skeleton";
import ModalDelete from "@/components/modal/ModalDelete";
import {
  useGetAllTechnologyQuery,
  useUpdateTechnologyMutation,
  TechnologyPayload,
} from "./technologyApi";
import { technologyType } from "@/types/program";
import Image from "next/image";
import { useCreateDocumentMutation } from "@/features/document/documentApi";
import generateFilename from "@/services/generate-filename";

type Props = { programUuid: string; programSlug: string };

export default function TechnologyAdmin({ programUuid, programSlug }: Props) {
  const {
    data: technologyRaw,
    isLoading,
    isError,
  } = useGetAllTechnologyQuery(programUuid, {
    refetchOnMountOrArgChange: true,
  });

  const [updateTechnology] = useUpdateTechnologyMutation();
  const [createDocument] = useCreateDocumentMutation();
  const [localTechs, setLocalTechs] = useState<technologyType[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<technologyType | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<technologyType | null>(null);

  // Sync server -> local
  useEffect(() => {
    if (technologyRaw && Array.isArray(technologyRaw)) {
      setLocalTechs(technologyRaw);
    } else {
      setLocalTechs([]);
    }
    setHasChanges(false);
  }, [technologyRaw]);

  // Add unique UID for rendering
  const techsWithUid = useMemo(
    () =>
      Array.isArray(localTechs)
        ? localTechs.map((t) => ({ ...t, uid: crypto.randomUUID() }))
        : [],
    [localTechs]
  );

  if (isLoading) return <SectionSkeleton count={4} />;
  if (isError)
    return <div className="text-destructive">Failed to load technologies</div>;

  // Add or edit local technology
  const handleSaveTechLocal = (
    data: TechnologyFormValues,
    target?: technologyType
  ) => {
    setLocalTechs((prev) => {
      const safe = Array.isArray(prev) ? prev : [];
      const newTechs = target
        ? safe.map((t) =>
            t.title === target.title && t.description === target.description
              ? { ...t, ...data }
              : t
          )
        : [...safe, { ...data }];
      return newTechs;
    });
    setHasChanges(true);
  };

  // Delete local technology
  const handleDeleteTechLocal = (target: technologyType) => {
    setLocalTechs((prev) => {
      const safe = Array.isArray(prev) ? prev : [];
      return safe.filter(
        (t) =>
          !(t.title === target.title && t.description === target.description)
      );
    });
    setHasChanges(true);
    toast.info(`Technology "${target.title}" deleted!`);
  };

  // Save all to backend
  const handleSaveAll = async () => {
    try {
      const payload: TechnologyPayload[] = (localTechs ?? []).map(
        ({ title, description, image }) => ({
          title,
          description,
          image,
        })
      );
      await updateTechnology({ programUuid, technology: payload }).unwrap();
      toast.success("All technologies saved!");
      setHasChanges(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to save technologies: ${message}`);
    }
  };

  // Upload logic for Technology
  const handleUploadTechnology = async (
    data: TechnologyFormValues,
    file?: File
  ) => {
    try {
      let imageUrl = data.image;

      // Upload file if exists
      if (file) {
        const toastId = toast.loading("Uploading technology image...");
        try {
          const uploadResult = await createDocument({
            file,
            programSlug: programSlug ,
            gen: 0,
            documentType: "logo",
            filename:  generateFilename({
                        type: "technology",
                        program: programSlug,
                        generation: String(""),
                      }),
          }).unwrap();
          imageUrl = uploadResult.uri;
          toast.dismiss(toastId);
        } catch {
          toast.dismiss(toastId);
          throw new Error("Failed to upload image");
        }
      }

      return { ...data, image: imageUrl };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to upload technology: ${message}`);
      throw err;
    }
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-[18px] font-bold text-foreground">Technologies</h2>

        <TechnologyFormModal
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          onSubmitTechnology={async (data, file) => {
            const techData = await handleUploadTechnology(data, file);
            handleSaveTechLocal(techData);
            setIsCreateOpen(false);
            toast.success(`Technology "${data.title}" added!`);
          }}
          trigger={
            <Button className="flex items-center gap-2.5">
              <FiPlus />
              <span className="font-bold cursor-pointer">Add Technology</span>
            </Button>
          }
          masterProgram={{ uuid: programUuid, slug: programSlug }}
          openingProgram={{ uuid: programUuid, generation: 1 }}
        />
      </div>

      {/* Technology List */}
      {techsWithUid.length === 0 ? (
        <div className="text-muted-foreground">
          No technologies yet. Add one to get started!
        </div>
      ) : (
        techsWithUid.map((t) => (
          <div
            key={t.uid}
            className="flex justify-between items-center bg-accent rounded-sm p-4"
          >
            <div className="flex items-start gap-4">
              {t.image && (
                <Image
                  unoptimized
                  width={48}
                  height={48}
                  src={t.image}
                  alt={t.title}
                  className="w-12 h-12 rounded-sm flex-shrink-0"
                />
              )}
              <div>
                <h3 className="text-xs md:text-base text-[16px] font-semibold text-foreground">
                  {t.title}
                </h3>
                <h3 className="text-xs text-muted-foreground">
                  {t.description}
                </h3>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <Trash
                size={16}
                className="text-destructive cursor-pointer"
                onClick={() => setDeleteTarget(t)}
              />
              <TechnologyFormModal
                open={
                  !!editTarget &&
                  editTarget.title === t.title &&
                  editTarget.description === t.description
                }
                onOpenChange={(open) => !open && setEditTarget(null)}
                initialData={editTarget || undefined}
                onSubmitTechnology={async (data, file) => {
                  if (editTarget) {
                    const techData = await handleUploadTechnology(data, file);
                    handleSaveTechLocal(techData, editTarget);
                    setEditTarget(null);
                    toast.success(`Technology "${data.title}" updated!`);
                  }
                }}
                trigger={
                  <SquarePen
                    size={16}
                    className="text-primary-hover cursor-pointer"
                    onClick={() => setEditTarget(t)}
                  />
                }
                masterProgram={{ uuid: programUuid, slug: programSlug }}
                openingProgram={{ uuid: programUuid, generation: 1 }}
              />
            </div>
          </div>
        ))
      )}

      {/* Delete Modal */}
      <ModalDelete
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={deleteTarget ? `Delete ${deleteTarget.title}?` : ""}
        description={
          deleteTarget
            ? `Are you sure you want to delete ${deleteTarget.title}? This action cannot be undone.`
            : ""
        }
        onDelete={() => {
          if (deleteTarget) handleDeleteTechLocal(deleteTarget);
          setDeleteTarget(null);
        }}
      />

      {/* Save All Button */}
      <div className="flex justify-end mt-4">
        <Button
          variant={hasChanges ? "default" : "outline"}
          disabled={!hasChanges}
          onClick={handleSaveAll}
        >
          Save All Technologies
        </Button>
      </div>
    </div>
  );
}
