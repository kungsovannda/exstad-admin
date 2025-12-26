"use client";

import React, { useState, useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { AddTopicFaq } from "./add-topic-dialog";
import { AddQuestionDialog } from "./add-question-dialog";
import DeleteModal from "@/features/master-program/components/delete-modal-component";
import { SquarePen, Trash } from "lucide-react";
import { useGetAllFaqQuery, useUpdateFaqsMutation } from "./faqApi";
import { FaqItem } from "@/types/program";
import { SectionSkeleton } from "../section-skeleton";

type Props = { programUuid: string };

export default function FaqAdmin({ programUuid }: Props) {
  const {
    data: faqs = [],
    isLoading,
    isError,
  } = useGetAllFaqQuery(programUuid, { refetchOnMountOrArgChange: true });

  const [updateFaqs] = useUpdateFaqsMutation();

  const [localFaqs, setLocalFaqs] = useState<FaqItem[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([String(0)]);
  const [editingTopicIndex, setEditingTopicIndex] = useState<number | null>(
    null
  );
  const [editingSection, setEditingSection] = useState<{
    faqIndex: number;
    index: number;
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "topic" | "section";
    faqIndex?: number;
    index?: number;
  } | null>(null);
  const [addingSectionReqIndex, setAddingSectionReqIndex] = useState<
    number | null
  >(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Load server FAQs into local state safely
  useEffect(() => {
    const safeFaqs = faqs.map((f) => ({
      ...f,
      faqs: Array.isArray(f.faqs) ? f.faqs : [],
    }));
    setLocalFaqs(safeFaqs);
    setHasChanges(false);
  }, [faqs]);

  const toggleExpand = (topicId: string) => {
    setExpandedItems((prev) =>
      prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId]
    );
  };

  if (isLoading) return <SectionSkeleton count={4} />;
  if (isError)
    return <div className="text-destructive">Failed to load FAQ</div>;

  // ✅ Local add/edit topic
  const handleSaveTopicLocal = (
    data: { title: string },
    targetIndex?: number
  ) => {
    let message = "";

    const newFaqs =
      targetIndex !== undefined
        ? localFaqs.map((r, i) => {
            if (i === targetIndex) {
              message = `FAQ Topic "${data.title}" updated!`;
              return {
                ...r,
                title: data.title,
                faqs: Array.isArray(r.faqs) ? r.faqs : [],
              };
            }
            return r;
          })
        : (() => {
            message = `FAQ Topic "${data.title}" created!`;
            return [...localFaqs, { title: data.title, faqs: [] }];
          })();

    setLocalFaqs(newFaqs);
    setHasChanges(true);
    toast.success(message);
  };

  // ✅ Local add/edit section
  const handleSaveSectionLocal = (
    faqIndex: number,
    data: { question: string; answer: string },
    sectionIndex?: number
  ) => {
    const newFaqs = [...localFaqs];
    const faq = newFaqs[faqIndex];
    if (!faq) return;

    const safeSections = Array.isArray(faq.faqs) ? [...faq.faqs] : [];
    const updatedSections =
      sectionIndex !== undefined
        ? safeSections.map((s, i) =>
            i === sectionIndex
              ? { ...s, question: data.question, answer: data.answer }
              : s
          )
        : [
            ...safeSections,
            {
              id: crypto.randomUUID(),
              question: data.question,
              answer: data.answer,
            },
          ];

    newFaqs[faqIndex] = { ...faq, faqs: updatedSections };
    setLocalFaqs(newFaqs);
    setHasChanges(true);
  };

  // ✅ Local delete
  const handleDeleteLocal = (
    type: "topic" | "section",
    faqIndex?: number,
    index?: number
  ) => {
    let deletedName = "";
    const newFaqs = [...localFaqs];

    if (type === "topic" && faqIndex !== undefined) {
      deletedName = newFaqs[faqIndex]?.title || `Topic #${faqIndex + 1}`;
      newFaqs.splice(faqIndex, 1);
    } else if (
      type === "section" &&
      faqIndex !== undefined &&
      index !== undefined
    ) {
      const faq = { ...newFaqs[faqIndex] };
      const sections = Array.isArray(faq.faqs) ? [...faq.faqs] : [];
      deletedName = sections[index]?.question || `Section #${index + 1}`;
      faq.faqs = sections.filter((_, i) => i !== index);
      newFaqs[faqIndex] = faq;
    }

    setLocalFaqs(newFaqs);
    setHasChanges(true);
    setDeleteTarget(null);
    toast.info(`Faq "${deletedName}" deleted!`);
  };

  const handleSaveAll = async () => {
    for (let i = 0; i < localFaqs.length; i++) {
      const topic = localFaqs[i];
      if (!topic.title || topic.title.trim() === "") {
        toast.error(`Topic #${i + 1} title is empty.`);
        return;
      }
      if (!topic.faqs || topic.faqs.length === 0) {
        toast.error(`Topic "${topic.title}" must have at least one question.`);
        return;
      }
      for (let j = 0; j < topic.faqs.length; j++) {
        const q = topic.faqs[j];
        if (!q.question || q.question.trim() === "") {
          toast.error(`Question #${j + 1} in topic "${topic.title}" is empty.`);
          return;
        }
        if (!q.answer || q.answer.trim() === "") {
          toast.error(
            `Answer for question "${q.question || "(empty)"}" is empty.`
          );
          return;
        }
      }
    }

    try {
      await updateFaqs({ programUuid, faq: localFaqs }).unwrap();
      toast.success("All FAQ saved!");
      setHasChanges(false);
    } catch (err: unknown) {
      if (err && typeof err === "object" && "data" in err) {
        const backendErrors = (
          err as { data?: { error?: { description?: { reason?: string }[] } } }
        ).data?.error?.description;
        if (Array.isArray(backendErrors) && backendErrors.length > 0) {
          backendErrors.forEach((e) =>
            toast.error(e.reason || "Validation failed")
          );
          return;
        }
      }
      const message = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to save FAQ: ${message}`);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-foreground">FAQ</h2>
        <AddTopicFaq
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          programUuid={programUuid}
          onSubmit={(data) => {
            handleSaveTopicLocal(data);
            setIsCreateOpen(false);
          }}
          trigger={
            <Button className="flex items-center gap-2.5">
              <FiPlus />{" "}
              <span className="text-[14px] font-bold cursor-pointer">
                Add Topic
              </span>
            </Button>
          }
        />
      </div>

      {(!localFaqs || localFaqs.length === 0) && (
        <div className="text-muted-foreground">No FAQ yet. Add one!</div>
      )}

      {localFaqs.map((faq, faqIndex) => {
        const isExpanded = expandedItems.includes(String(faqIndex));
        const sections = Array.isArray(faq.faqs) ? faq.faqs : [];

        return (
          <div
            key={faq.title || faqIndex}
            className="flex flex-col gap-2.5 bg-accent rounded-sm p-4"
          >
            {/* Topic Header */}
            <div className="flex justify-between items-center">
              <div
                className="flex items-center gap-2.5 cursor-pointer"
                onClick={() => toggleExpand(String(faqIndex))}
              >
                <FiPlus className="bg-black rounded-full text-white text-lg" />
                <span className="text-[16px] font-semibold">{faq.title}</span>
              </div>
              <div className="flex gap-2 items-center">
                <Trash
                  size={16}
                  className="text-destructive cursor-pointer"
                  onClick={() => setDeleteTarget({ type: "topic", faqIndex })}
                />
                <SquarePen
                  size={16}
                  className="text-primary-hover cursor-pointer"
                  onClick={() => setEditingTopicIndex(faqIndex)}
                />
                <AddTopicFaq
                  programUuid={programUuid}
                  open={editingTopicIndex === faqIndex}
                  onOpenChange={(open) =>
                    setEditingTopicIndex(open ? faqIndex : null)
                  }
                  initialData={{ title: faq.title }}
                  onSubmit={(data) => {
                    handleSaveTopicLocal(data, faqIndex);
                    setEditingTopicIndex(null);
                  }}
                />
                <FaChevronDown
                  onClick={() => toggleExpand(String(faqIndex))}
                  className={`transition-transform duration-200 ${
                    isExpanded ? "rotate-180" : "rotate-0"
                  }`}
                />
              </div>
            </div>

            {/* Sections */}
            {isExpanded && (
              <div className="flex flex-col gap-2.5 mt-2">
                {sections.map((s, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-1 p-2.5 bg-background rounded-[4px]"
                  >
                    <div className="flex items-center gap-2.5">
                      <FaChevronRight className="bg-[#0FC65E] rounded-full p-1 text-white text-[18px]" />
                      <span className="text-[14px] font-semibold">
                        {s.question}
                      </span>
                    </div>
                    <div className="ml-7 text-[14px] text-muted-foreground">
                      {s.answer}
                    </div>
                    <div className="flex gap-2 mt-1 items-center ml-7">
                      <Trash
                        size={16}
                        className="text-destructive cursor-pointer"
                        onClick={() =>
                          setDeleteTarget({
                            type: "section",
                            faqIndex,
                            index,
                          })
                        }
                      />
                      <SquarePen
                        size={16}
                        className="text-primary-hover cursor-pointer"
                        onClick={() => setEditingSection({ faqIndex, index })}
                      />
                      <AddQuestionDialog
                        programUuid={programUuid}
                        faqIndex={faqIndex}
                        open={
                          editingSection?.faqIndex === faqIndex &&
                          editingSection?.index === index
                        }
                        onOpenChange={(open) =>
                          !open && setEditingSection(null)
                        }
                        onSubmit={(data) =>
                          handleSaveSectionLocal(faqIndex, data, index)
                        }
                        initialQuestion={s.question}
                        initialAnswer={s.answer}
                      />
                    </div>
                  </div>
                ))}

                <AddQuestionDialog
                  programUuid={programUuid}
                  faqIndex={faqIndex}
                  open={addingSectionReqIndex === faqIndex}
                  onOpenChange={(open) =>
                    !open && setAddingSectionReqIndex(null)
                  }
                  onSubmit={(data) => handleSaveSectionLocal(faqIndex, data)}
                  submitText="Add Question"
                />

                <Button
                  className="flex items-center w-fit gap-2.5 mt-2"
                  onClick={() => setAddingSectionReqIndex(faqIndex)}
                >
                  <FiPlus className="text-[18px]" />
                  <span className="text-[14px] font-bold cursor-pointer">
                    Add Question
                  </span>
                </Button>
              </div>
            )}
          </div>
        );
      })}

      {deleteTarget && (
        <DeleteModal
          open={!!deleteTarget}
          onOpenChange={(open) => !open && setDeleteTarget(null)}
          itemName={deleteTarget.type === "topic" ? "topic" : "section"}
          onConfirm={() =>
            deleteTarget &&
            handleDeleteLocal(
              deleteTarget.type,
              deleteTarget.faqIndex,
              deleteTarget.index
            )
          }
        />
      )}

      {/* ✅ Save All Button */}
      <div className="flex justify-end mt-4">
        <Button
          variant={hasChanges ? "default" : "outline"}
          disabled={!hasChanges}
          onClick={handleSaveAll}
        >
          Save All FAQ
        </Button>
      </div>
    </div>
  );
}
