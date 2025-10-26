import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetAllBadgeQuery } from "@/features/badge/badgeApi";
import { Scholar } from "@/types/scholar";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateScholarBadgeMutation } from "@/features/scholar-badge/scholarBadgeApi";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { AlertDialog } from "@radix-ui/react-alert-dialog";
import {
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
const schema = z.object({
  badge: z.string(),
  completionDate: z.date(),
});

export function AssignBadgeScholar({
  open,
  onOpenChange,
  scholars,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scholars: Scholar[];
}) {
  const [showProgressDialog, setShowProgressDialog] = useState(false);
  const [successCount, setSuccessCount] = useState(0);
  const [failureCount, setFailureCount] = useState(0);
  const [currentProgress, setCurrentProgress] = useState(0);
  const { data: badges } = useGetAllBadgeQuery();
  const [assignBadgeScholar] = useCreateScholarBadgeMutation();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      badge: "",
      completionDate: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof schema>) {
    setShowProgressDialog(true);
    setSuccessCount(0);
    setFailureCount(0);
    setCurrentProgress(0);

    let success = 0;
    let failure = 0;

    for (let i = 0; i < scholars.length; i++) {
      try {
        await assignBadgeScholar({
          scholarUuid: scholars[i].uuid,
          badgeUuid: values.badge,
          completionDate: values.completionDate.toISOString(),
        }).unwrap();
        success++;
      } catch {
        failure++;
      }
      setSuccessCount(success);
      setFailureCount(failure);
      setCurrentProgress(Math.round(((i + 1) / scholars.length) * 100));
    }

    if (success + failure === scholars.length) {
      setTimeout(() => {
        setShowProgressDialog(false);
        onOpenChange(false);
      }, 3000);
    }
  }

  return (
    <Dialog
      open={open && !showProgressDialog}
      onOpenChange={(isOpen) => {
        if (!isOpen) form.reset();
        onOpenChange(isOpen);
      }}
    >
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        className="sm:max-w-[425px]"
      >
        <DialogHeader>
          <DialogTitle>Assign Badge</DialogTitle>
          <DialogDescription>
            {scholars.length > 1
              ? `You are about to assign a badge to ${scholars.length} scholars.`
              : `You are about to assign a badge to ${scholars[0].englishName}.`}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="assign-badge-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="badge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Choose a badge</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Badge" />
                      </SelectTrigger>
                      <SelectContent>
                        {badges?.map((d) => (
                          <SelectItem key={d.uuid} value={d.uuid}>
                            {d.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="completionDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Completion Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            " pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button form="assign-badge-form" type="submit">
            Assign
          </Button>
        </DialogFooter>
      </DialogContent>
      {
        <AlertDialog
          open={showProgressDialog}
          onOpenChange={setShowProgressDialog}
        >
          <AlertDialogContent className="min-w-xl bg-accent">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-center">
                {currentProgress === 100 && successCount > 0
                  ? "Assignation Complete!"
                  : "Assigning Badges"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                Please wait while we assign badge to scholar. This process may
                take a few moments.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="flex flex-col items-center justify-center w-full gap-4 p-6">
              <div className="w-full space-y-3">
                <Progress value={currentProgress} className="w-full" />

                <div className="text-center text-sm">
                  <p>
                    {successCount} of {scholars.length} scholar badge assigned
                  </p>

                  {failureCount > 0 && (
                    <p className="text-red-500 mt-1">
                      {failureCount} failed to assign
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
      }
    </Dialog>
  );
}
