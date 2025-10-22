import ModalProcess from "@/components/modal/ModalProcess";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllAchievementsQuery } from "@/features/achievement/achievementApi";
import { Scholar } from "@/types/scholar";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateScholarAchievementMutation } from "../scholarAchievementApi";
const schema = z.object({
  achievement: z.string(),
});

export default function AssignScholarAchievement({
  open,
  onOpenChange,
  scholars,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scholars: Scholar[];
}) {
  const [showProgressDialog, setShowProgressDialog] = useState(false);
  const [stateProcess, setStateProcess] = useState<{
    currentProgress: number;
    successCount: number;
    failureCount: number;
  }>({
    currentProgress: 0,
    successCount: 0,
    failureCount: 0,
  });
  const { data: achievements } = useGetAllAchievementsQuery();
  const [assignAchievement] = useCreateScholarAchievementMutation();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      achievement: "",
    },
  });

  async function onSubmit(values: z.infer<typeof schema>) {
    setShowProgressDialog(true);
    setStateProcess({
      currentProgress: 0,
      successCount: 0,
      failureCount: 0,
    });

    let success = 0;
    let failure = 0;

    for (let i = 0; i < scholars.length; i++) {
      try {
        await assignAchievement({
          scholarUuid: scholars[i].uuid,
          body: {
            achievementUuid: values.achievement,
          },
        }).unwrap();
        success++;
      } catch {
        failure++;
      }
      setStateProcess({
        currentProgress: Math.round(((i + 1) / scholars.length) * 100), // ✅ Fixed
        successCount: success, // ✅ Fixed
        failureCount: failure, // ✅ Fixed
      });
    }
    if (success + failure === scholars.length) {
      setTimeout(() => {
        setShowProgressDialog(false);
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
          <DialogTitle>Assign achievement</DialogTitle>
          <DialogDescription>
            {scholars.length > 1
              ? `You are about to assign a achievement to ${scholars.length} scholars.`
              : `You are about to assign a achievement to ${scholars[0].englishName}.`}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="assign-achievement-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="achievement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Achievement</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger
                        style={{ width: "var(--radix-select-trigger-width)" }}
                        className="h-fit overflow-hidden min-h-[3rem]"
                      >
                        <SelectValue placeholder="Select an achievement">
                          {/* Custom display for selected value */}
                          {field.value &&
                            achievements?.find(
                              (a) => a.uuid === field.value
                            ) && (
                              <div className="flex h-12 items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage
                                    className="rounded-lg object-cover"
                                    src={
                                      achievements.find(
                                        (a) => a.uuid === field.value
                                      )?.icon || "/placeholder.svg"
                                    }
                                    alt={
                                      achievements.find(
                                        (a) => a.uuid === field.value
                                      )?.title
                                    }
                                  />
                                  <AvatarFallback>
                                    {achievements
                                      .find((a) => a.uuid === field.value)
                                      ?.title.split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                      .toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col items-start">
                                  <span className="font-medium">
                                    {
                                      achievements.find(
                                        (a) => a.uuid === field.value
                                      )?.title
                                    }
                                  </span>
                                  <span className="text-sm text-muted-foreground line-clamp-1">
                                    {
                                      achievements.find(
                                        (a) => a.uuid === field.value
                                      )?.description
                                    }
                                  </span>
                                </div>
                              </div>
                            )}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent
                      style={{ width: "var(--radix-select-trigger-width)" }}
                      className="max-h-80 overflow-hidden"
                    >
                      <Command>
                        <CommandInput
                          placeholder="Search achievements..."
                          className="h-9"
                        />
                        <CommandList>
                          <ScrollArea className="h-72">
                            <CommandEmpty>No achievement found.</CommandEmpty>
                            <CommandGroup>
                              {achievements
                                ?.filter((x) => x.title)
                                .map((option) => (
                                  <CommandItem
                                    key={option.uuid}
                                    value={option.title}
                                    onSelect={() => {
                                      field.onChange(option.uuid);
                                    }}
                                    className="cursor-pointer"
                                  >
                                    <SelectItem value={option.uuid}>
                                      <div className="flex h-12 items-center gap-3 w-full">
                                        <Avatar className="h-10 w-10">
                                          <AvatarImage
                                            className="rounded-lg object-cover"
                                            src={
                                              option.icon || "/placeholder.svg"
                                            }
                                            alt={option.title}
                                          />
                                          <AvatarFallback>
                                            {option.title
                                              .split(" ")
                                              .map((n) => n[0])
                                              .join("")
                                              .toUpperCase()}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col items-start">
                                          <span className="font-medium">
                                            {option.title}
                                          </span>
                                          <span className="text-sm text-muted-foreground line-clamp-1">
                                            {option.description}
                                          </span>
                                        </div>
                                      </div>
                                    </SelectItem>
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          </ScrollArea>
                        </CommandList>
                      </Command>
                    </SelectContent>
                  </Select>
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
          <Button form="assign-achievement-form" type="submit">
            Assign
          </Button>
        </DialogFooter>
      </DialogContent>
      {showProgressDialog && (
        <ModalProcess
          {...stateProcess}
          title="Please wait while we assigning the achievement. This process may take a few moments."
          open={showProgressDialog}
          onOpenChange={setShowProgressDialog}
          beingGenerateMsg="Updating..."
          completeGenerateMsg="Updating Complete"
          successMsg="achievement assigned"
          failMsg="fail to assign achievement"
          total={scholars.length}
        />
      )}
    </Dialog>
  );
}
