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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { openingProgramType } from "@/types/opening-program";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  subject: z.string().min(2).max(100),
  message: z.string().min(2).max(500),
  examDate: z.date(),
  examTime: z.string().min(2).max(100),
  location: z.string().url(),
});

type FormValues = z.infer<typeof schema>;

export function SendEmailModal({
  open,
  onOpenChange,
  openingProgram,
  onSubmitForm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  openingProgram: openingProgramType;
  onSubmitForm: (values: {
    subject: string;
    message: string;
    examDate: string;
    examTime: string;
    location: string;
  }) => void;
}) {
  const examDateDefault = (() => {
    const examTimeline = openingProgram.timeline?.find((t) =>
      t.title.toLowerCase().includes("exam")
    );
    return examTimeline?.startDate
      ? new Date(examTimeline.startDate)
      : new Date();
  })();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      subject: "",
      message: "",
      examDate: examDateDefault,
      examTime: "09:00",
      location: "https://maps.app.goo.gl/wjhqKtZq1x1CzS3Z8",
    },
  });

  function onSubmit(values: FormValues) {
    const { examDate, examTime, ...rest } = values;

    const formattedDate = examDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Phnom_Penh",
    });

    const formattedTime = new Date(`1970-01-01T${examTime}`).toLocaleTimeString(
      "en-US",
      {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Phnom_Penh",
      }
    );

    const finalValues = {
      ...rest,
      examDate: formattedDate,
      examTime: formattedTime,
    };

    onSubmitForm(finalValues);
    onOpenChange(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) form.reset();
        onOpenChange(isOpen);
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send Admission Email</DialogTitle>
          <DialogDescription>
            Fill in the details below to send the admission letter with exam
            information.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="send-email-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* Subject */}
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Admission Letter - Entrance Exam"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Message (textarea) */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="Congratulations! You are invited to take the entrance exam..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Exam Date (Calendar Picker) */}
            <FormField
              control={form.control}
              name="examDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Exam Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "pl-3 text-left font-normal",
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
                        onSelect={(date) => {
                          if (date) field.onChange(date);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Exam Time (Time Picker) */}
            <FormField
              control={form.control}
              name="examTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exam Time (Cambodia)</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      step="1"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location (Google Maps)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://maps.app.goo.gl/..."
                      {...field}
                    />
                  </FormControl>
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
          <Button form="send-email-form" type="submit">
            Send Email
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
