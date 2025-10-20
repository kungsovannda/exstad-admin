import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Progress } from "../ui/progress";

interface ModalProcessProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentProgress: number;
  successCount: number;
  failureCount: number;
  total: number;
  title: string;
  failMsg: string;
  successMsg: string;
  beingGenerateMsg: string;
  completeGenerateMsg: string;
}

export default function ModalProcess({
  open,
  onOpenChange,
  currentProgress,
  successCount,
  failureCount,
  total,
  title,
  failMsg,
  successMsg,
  beingGenerateMsg,
  completeGenerateMsg,
}: ModalProcessProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="min-w-xl bg-accent">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">
            {currentProgress === 100 && successCount > 0
              ? `${completeGenerateMsg}`
              : `${beingGenerateMsg}`}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {title ??
              "Please wait while we assign badge to scholar. This process may take a few moments."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-col items-center justify-center w-full gap-4 p-6">
          <div className="w-full space-y-3">
            <Progress value={currentProgress} className="w-full" />

            <div className="text-center text-sm">
              <p>
                {successCount} of {total} {successMsg}
              </p>

              {failureCount > 0 && (
                <p className="text-red-500 mt-1">
                  {failureCount} {failMsg}
                </p>
              )}
            </div>
          </div>

          {currentProgress === 100 && (
            <p className="text-xs text-gray-500">
              This dialog will close automatically in 3 seconds
            </p>
          )}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
