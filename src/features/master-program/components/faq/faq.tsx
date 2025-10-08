  "use client";

  import React, { useState } from "react";
  import { FiPlus } from "react-icons/fi";
  import { FaChevronDown, FaChevronRight } from "react-icons/fa";
  import { Button } from "@/components/ui/button";
  import { toast } from "sonner";

  import { AddTopicFaq } from "./add-topic-dialog";
  import { AddQuestionDialog } from "./add-question-dialog";
  import DeleteModal from "@/components/program/opening-program/activity/delete-modal-component";
  import { SquarePen, Trash } from "lucide-react";
  import { useGetAllFaqQuery, useUpdateFaqsMutation } from "./faqApi";
  import { FaqItem } from "@/types/program";
import { SectionSkeleton } from "../section-skeleton";
  type Props = { programUuid: string };

  export default function FaqAdmin({ programUuid }: Props) {
    const { data: faqs = [], isLoading, isError } = 
    useGetAllFaqQuery(programUuid, {
      refetchOnMountOrArgChange: true,
    });

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const toggleExpand = (topicId: string) => {
      setExpandedItems((prev) =>
        prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]
      );
    };
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const [editingTopicIndex, setEditingTopicIndex] = useState<number | null>(null);
    const [editingSection, setEditingSection] = useState<{
      faqIndex: number;
      index: number;
    } | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<{
      type: "topic" | "section";
      faqIndex?: number;
      index?: number;
    } | null>(null);
    const [addingSectionReqIndex, setAddingSectionReqIndex] = useState<number | null>(null);

    const [updateFaqs] = useUpdateFaqsMutation();

    if (isLoading) return <SectionSkeleton count={4}/>;
    if (isError) return <div className="text-destructive">Failed to load FAQ</div>;

    const handleSaveTopic = async (
      data: { title: string }, 
      targetIndex?: number
    ) => {
      try {
        const safeFaqs = faqs ?? [];
        let newFaqs: FaqItem[] ;
        if(targetIndex !== undefined) {
          newFaqs = safeFaqs.map((r,i) => 
          i === targetIndex ? {...r,title:data.title}:r
        );
        }else{
          newFaqs = [
            ...safeFaqs,
            {title:data.title,faqs:[]}
          ]
        }
        await updateFaqs({ programUuid, faq: newFaqs }).unwrap();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        toast.error(`Failed to save topic: ${message || err}`);
      }
    };

    const handleSaveSection = async (
      faqIndex: number,
      data: { question: string; answer: string },
      sectionIndex?: number
    ) => {
      try {
        const safeFaqs = faqs.map((r) => ({ 
          ...r, 
          faqs: [...(r.faqs || [])],
        }));
        const faq = safeFaqs[faqIndex];
        if (!faq) return;

      const updatedFaq =
          sectionIndex !== undefined
            ? { ...faq,faqs: (faq.faqs || []).map((d, i) => i === sectionIndex ? { ...d, question: data.question, answer: data.answer } : d), }
            : { ...faq,faqs: [...(faq.faqs || []), { id: crypto.randomUUID(), question: data.question, answer: data.answer }],  };

            safeFaqs[faqIndex] = updatedFaq;
        await updateFaqs({ programUuid, faq: safeFaqs }).unwrap();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        toast.error(`Failed to save section: ${message}`);
      }
    };



    const handleDelete = async (type: "topic" | "section", faqIndex?: number, index?: number) => {
      try {
        const safeFaqs = [...faqs];
        let newFaqs: FaqItem[];

        if (type === "topic" && faqIndex !== undefined) {
          newFaqs = safeFaqs.filter((_, i) => i !== faqIndex);
        } else if (type === "section" && faqIndex !== undefined && index !== undefined) {
          const faq = { ...safeFaqs[faqIndex], faqs: safeFaqs[faqIndex].faqs.filter((_, i) => i !== index) };
          newFaqs = safeFaqs.map((r, i) => (i === faqIndex ? faq : r));
        } else return;

        await updateFaqs({ programUuid, faq: newFaqs }).unwrap();
        toast.success(type === "topic" ? "Topic deleted!" : "Section deleted!");
        setDeleteTarget(null);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        toast.error(`Failed to delete: ${message}`);
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
            onSubmit={async (data) => {
              await handleSaveTopic(data);
              setIsCreateOpen(false);
            }}
            trigger={
              <Button className="flex items-center gap-2.5">
                <FiPlus /> <span className="text-[14px] font-bold cursor-pointer">Add Topic</span>
              </Button>
            }
          />
        </div>

        {(!faqs || faqs.length === 0) && (
          <div className="text-muted-foreground">No FAQ yet. Add one!</div>
          )}

        {(faqs || []).map((faq, faqIndex) => {
          const isExpanded = expandedItems.includes(String(faqIndex));
          const sections = faq.faqs || [];

          return (
            <div key={faq.title || faqIndex} className="flex flex-col gap-2.5 bg-accent rounded-sm p-4">
              {/* Topic Header */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => toggleExpand(String(faqIndex))}>
                  <FiPlus className="bg-black rounded-full text-white text-lg" />
                  <span className="text-[16px] font-semibold">{faq.title}</span>
                </div>
                <div className="flex gap-2 items-center">
                  <Trash size={16} className="text-destructive cursor-pointer" onClick={() => setDeleteTarget({ type: "topic", faqIndex })} />
                  <SquarePen size={16} className="text-primary-hover cursor-pointer" onClick={() => setEditingTopicIndex(faqIndex)} />
                  <AddTopicFaq
                    programUuid={programUuid}
                    open={editingTopicIndex === faqIndex}
                    onOpenChange={(open) => setEditingTopicIndex(open ? faqIndex : null)}
                    initialData={{ title: faq.title }}
                    onSubmit={async (data) => {
                      await handleSaveTopic(data, faqIndex);
                      setEditingTopicIndex(null);
                    }}
                  />
                  <FaChevronDown
                    onClick={() => toggleExpand(String(faqIndex))}
                    className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : "rotate-0"}`}
                  />
                </div>
              </div>

              {/* Sections */}
              {isExpanded && (
                <div className="flex flex-col gap-2.5 mt-2">
                  {sections.map((s, index) => (
                    <div key={index} className="flex flex-col gap-1 p-2.5 bg-background rounded-[4px]">
                      <div className="flex items-center gap-2.5">
                        <FaChevronRight className="bg-[#0FC65E] rounded-full p-1 text-white text-[18px]" />
                        <span className="text-[14px] font-semibold">{s.question}</span>
                      </div>
                      <div className="ml-7 text-[14px] text-muted-foreground">{s.answer}</div>
                      <div className="flex gap-2 mt-1 items-center ml-7">
                        <Trash
                          size={16}
                          className="text-destructive cursor-pointer"
                          onClick={() => setDeleteTarget({ type: "section", faqIndex, index })}
                        />
                        <SquarePen
                          size={16}
                          className="text-primary-hover cursor-pointer"
                          onClick={() => setEditingSection({ faqIndex, index })}
                        />
                        <AddQuestionDialog
                          programUuid={programUuid}
                          faqIndex={faqIndex}
                          open={editingSection?.faqIndex === faqIndex && editingSection?.index === index}
                          onOpenChange={(open) => !open && setEditingSection(null)}
                          onSubmit={(data) => handleSaveSection(faqIndex, data, index)}
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
                    onOpenChange={(open) => !open && setAddingSectionReqIndex(null)}
                    onSubmit={(data) => handleSaveSection(faqIndex, data)}
                    submitText="Add Question"
                  />

                  <Button
                    className="flex items-center w-fit gap-2.5 mt-2"
                    onClick={() => setAddingSectionReqIndex(faqIndex)}
                  >
                    <FiPlus className="text-[18px]" />
                    <span className="text-[14px] font-bold cursor-pointer">Add Question</span>
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
              deleteTarget && handleDelete(deleteTarget.type, deleteTarget.faqIndex, deleteTarget.index)
            }
          />
        )}
      </div>
    );
  }
