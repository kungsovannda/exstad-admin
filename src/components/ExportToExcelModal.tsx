import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, GripVertical, X } from "lucide-react";
import React, { useEffect, useState } from "react";

interface ExportToExcelModalProps<T extends Record<string, unknown>> {
  data: T[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExport: (selectedFields: string[]) => void;
}

export default function ExportToExcelModal<T extends Record<string, unknown>>({
  data,
  open,
  onOpenChange,
  onExport,
}: ExportToExcelModalProps<T>) {
  const [selectedFields, setSelectedFields] = useState<(keyof T)[]>([]);
  const [availableFields, setAvailableFields] = useState<(keyof T)[]>([]);
  const [draggedItem, setDraggedItem] = useState<keyof T | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  useEffect(() => {
    if (data && data.length > 0) {
      const fields = Object.keys(data[0]) as (keyof T)[];
      setAvailableFields(fields);
    }
  }, [data]);

  const handleSelectField = (field: keyof T) => {
    if (!selectedFields.includes(field)) {
      setSelectedFields([...selectedFields, field]);
    }
  };

  const handleRemoveField = (field: keyof T) => {
    setSelectedFields(selectedFields.filter((f) => f !== field));
  };

  const handleDragStart = (field: keyof T) => {
    setDraggedItem(field);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedItem === null) return;

    const dragIndex = selectedFields.indexOf(draggedItem);
    const newSelectedFields = [...selectedFields];
    newSelectedFields.splice(dragIndex, 1);
    newSelectedFields.splice(dropIndex, 0, draggedItem);

    setSelectedFields(newSelectedFields);
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  const handleExport = () => {
    if (selectedFields.length === 0) {
      alert("Please select at least one field to export");
      return;
    }
    // Convert (keyof T)[] to string[] for the callback
    const fieldsAsStrings = selectedFields.map((field) => String(field));
    onExport(fieldsAsStrings);
    onOpenChange(false);
  };

  const formatFieldName = (field: keyof T): string => {
    return String(field)
      .replace(/([A-Z])/g, " $1")
      .replace(/_/g, " ")
      .trim()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-full max-w-sm sm:max-w-3xl md:max-w-4xl overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Export to Excel
          </DialogTitle>
          <DialogDescription>
            Select and arrange the fields you want to export
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col space-y-4 py-4">
          <div className="flex gap-4  overflow-hidden">
            <div className="flex-1 flex flex-col space-y-2">
              <label className="text-sm font-medium">
                Selected Fields ({selectedFields.length})
              </label>
              <div className="flex-1 h-full max-h-[400px] border-2 border-dashed rounded-lg p-3 overflow-y-auto">
                {selectedFields.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                    Select fields from the right to export
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {selectedFields.map((field, index) => (
                      <div
                        key={String(field)}
                        draggable
                        onDragStart={() => handleDragStart(field)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDrop={(e) => handleDrop(e, index)}
                        onDragEnd={handleDragEnd}
                        className={`
                          group flex items-center gap-2 px-3 py-2 bg-primary/60 text-white rounded-lg
                          cursor-move hover:bg-primary transition-all
                          ${draggedItem === field ? "opacity-50 scale-95" : ""}
                          ${
                            dragOverIndex === index && draggedItem !== field
                              ? "scale-105"
                              : ""
                          }
                        `}
                        style={{
                          animation:
                            dragOverIndex === index
                              ? "pulse 0.3s ease-in-out"
                              : "none",
                        }}
                      >
                        <GripVertical className="w-4 h-4 opacity-70" />
                        <span className="text-sm font-medium flex-1">
                          {formatFieldName(field)}
                        </span>
                        <button
                          onClick={() => handleRemoveField(field)}
                          className="ml-1 hover:bg-primary/70 rounded p-0.5 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Drag to reorder • Click X to remove
              </p>
            </div>

            {/* Available Fields - Right Side */}
            <div className="flex-1 flex flex-col space-y-2">
              <label className="text-sm font-medium">Available Fields</label>
              <div className="flex-1 grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto p-2 border rounded-lg">
                {availableFields.map((field) => {
                  const isSelected = selectedFields.includes(field);
                  return (
                    <Button
                      variant={"outline"}
                      key={String(field)}
                      onClick={() => !isSelected && handleSelectField(field)}
                      disabled={isSelected}
                      className={`
                        px-4 py-2 rounded-lg text-sm font-medium text-left transition-all justify-start
                        ${
                          isSelected
                            ? "cursor-not-allowed"
                            : "hover:border-primary cursor-pointer"
                        }
                      `}
                    >
                      {formatFieldName(field)}
                      {isSelected && (
                        <span className="ml-2 text-xs">(selected)</span>
                      )}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            onClick={() => onOpenChange(false)}
            variant="outline"
            className="px-4"
          >
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={selectedFields.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            Export ({selectedFields.length} fields)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
