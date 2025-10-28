"use client";

import { type ColumnDef } from "@tanstack/react-table";

import ExportToExcelModal from "@/components/ExportToExcelModal";
import ModalProcess from "@/components/modal/ModalProcess";
import { DataTable } from "@/components/table/data-table";
import { DataTableToolbar } from "@/components/table/data-table-toolbar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUpdateEnrollmentMutation } from "@/features/enrollment/enrollmentApi";
import { useDataTable } from "@/hooks/use-data-table";
import { exportToExcel } from "@/services/export-to-excel";
import { Enrollment } from "@/types/enrollment";
import { ChevronDown, Printer } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useAppSelector } from "@/lib/hooks";
import { ApplicantLetterRequest } from "@/types/application";
import { useDownloadApplicantLettersZipMutation } from "@/features/application/applicationApi";
import { toast } from "sonner";

interface PaidEnrollmentTableProps<TValue> {
  columns: ColumnDef<Enrollment, TValue>[];
  data: Enrollment[];
  totalItems: number;
  codeNumber?: string;
  codeTable?: string;
}

export function PaidEnrollmentTable<TValue>({
  columns,
  data,
  totalItems,
  codeNumber,
  codeTable,
}: PaidEnrollmentTableProps<TValue>) {
  const searchParams = useSearchParams();
  const perPage = searchParams.get("perPage")
    ? Number(searchParams.get("perPage"))
    : 10;
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportMode, setExportMode] = useState<"selected" | "all">("selected");
  const [isMarkInterviewModalOpen, setIsMarkInterviewModalOpen] =
    useState(false);
  const [isShortCourse, setIsShortCourse] = useState(false);
  const [stateProcess, setStateProcess] = useState<{
    currentProgress: number;
    successCount: number;
    failureCount: number;
  }>({
    currentProgress: 0,
    successCount: 0,
    failureCount: 0,
  });

  const [updateEnrollment] = useUpdateEnrollmentMutation();
  const preference = useAppSelector((state) => state.preference);

  useEffect(() => {
    setIsShortCourse(searchParams.get("type") === "short-course");
  }, [searchParams]);

  async function onMarkInterviewHandle() {
    setIsMarkInterviewModalOpen(true);
    setStateProcess({
      currentProgress: 0,
      successCount: 0,
      failureCount: 0,
    });

    let success = 0;
    let failure = 0;

    const selectedEnroll = table
      .getSelectedRowModel()
      .rows.map((row) => row.original as Enrollment);

    for (let i = 0; i < selectedEnroll.length; i++) {
      try {
        await updateEnrollment({
          uuid: selectedEnroll[i].uuid,
          body: {
            isInterviewed: true,
          },
        }).unwrap();
        success++;
      } catch {
        failure++;
      }
      setStateProcess({
        currentProgress: Math.round(((i + 1) / selectedEnroll.length) * 100),
        successCount: success,
        failureCount: failure,
      });
    }

    if (success + failure === selectedEnroll.length) {
      setTimeout(() => {
        setIsMarkInterviewModalOpen(false);
      }, 3000);
    }
  }

  const handleExport = async (selectedFields: string[]) => {
    const exportData =
      exportMode === "all"
        ? data
        : table
            .getSelectedRowModel()
            .rows.map((row) => row.original as Enrollment);

    await exportToExcel({
      data: exportData,
      selectedFields,
      filename: `paid-enrollments-${exportMode}-${
        new Date().toISOString().split("T")[0]
      }.xlsx`,
      exportType: preference.export,
    });
  };

  const openExportModal = (mode: "selected" | "all") => {
    setExportMode(mode);
    setIsExportModalOpen(true);
  };

  const { table } = useDataTable({
    data,
    columns,
    pageCount: Math.ceil(totalItems / perPage),
    shallow: true,
    debounceMs: 200,
    enableGlobalFilter: true,
    enableColumnFilters: true,
    enableSorting: true,
  });

  const hasSelectedRows = table.getSelectedRowModel().rows.length > 0;

  const [downloadZip] = useDownloadApplicantLettersZipMutation();
  const onGenerateApplicationLetter = async () => {
    const selectedEnrollment = table
      .getSelectedRowModel()
      .rows.map((r) => r.original);

    const enrollments = selectedEnrollment.sort((a, b) =>
      a.khmerName.localeCompare(b.khmerName, "km")
    );

    const payload: ApplicantLetterRequest[] = enrollments.map((e, index) => {
      const seq = String(index + 1).padStart(3, "0");
      return {
        ...e,
        placeOfBirth: e.currentAddress,
        issueDate: new Date().toISOString(),
        major: e.extra.major,
        national: "ខ្មែរ",
        year: e.extra.year,
        number: `${codeNumber}-${seq}`,
        tableNumber: `${codeTable}-${seq}`,
      };
    });
    const toastId = toast.loading("Generating...");

    try {
      const blob = await downloadZip(payload).unwrap();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "applicant_letters.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Generated success please download!", { id: toastId });
    } catch (error) {
      toast.error("Download failed: " + error, { id: toastId });
    }
  };

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size={"sm"} variant={"outline"}>
              <Printer />
              Export
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Export Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={!hasSelectedRows}
              onClick={() => openExportModal("selected")}
            >
              Export Selected ({table.getSelectedRowModel().rows.length})
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openExportModal("all")}>
              Export All ({data.length})
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {!isShortCourse && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                disabled={!hasSelectedRows}
                size={"sm"}
                variant={"outline"}
              >
                Actions
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onMarkInterviewHandle}>
                Mark as Interviewed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onGenerateApplicationLetter}>
                Application Letter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </DataTableToolbar>

      {isExportModalOpen && (
        <ExportToExcelModal
          data={
            exportMode === "all"
              ? data
              : table
                  .getSelectedRowModel()
                  .rows.map((row) => row.original as Enrollment)
          }
          open={isExportModalOpen}
          onOpenChange={setIsExportModalOpen}
          onExport={handleExport}
        />
      )}

      {isMarkInterviewModalOpen && (
        <ModalProcess
          {...stateProcess}
          title="Please wait while we marking the enrollments as interviewed. This process may take a few moments."
          open={isMarkInterviewModalOpen}
          onOpenChange={setIsMarkInterviewModalOpen}
          beingGenerateMsg="Updating Enrollment..."
          completeGenerateMsg="Updating Complete"
          successMsg="enrollments marked as interviewed"
          failMsg="fail to mark enrollment"
          total={table.getSelectedRowModel().rows.length}
        />
      )}
    </DataTable>
  );
}
