"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Scholar, ScholarSpecialistSetUp } from "@/types/scholar";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  useAssignSpecialistsMutation,
  useMarkIsAbroadMutation,
  useUnMarkIsAbroadMutation,
} from "../../scholarApi";
import { useEffect } from "react";

const formSchema = z.object({
  isAbroad: z.boolean(),
  universityName: z.string().min(1),
  degreeType: z.string().min(1),
  country: z.string().min(1),
  specialist: z.string(),
  about: z.string(),
});

export default function ScholarSpecialistSetUpComponent({
  scholar,
}: {
  scholar: Scholar | null;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isAbroad: scholar?.isAbroad ?? false,
      country: scholar?.specialist?.[0].country ?? "",
      universityName: scholar?.specialist?.[0].universityName ?? "",
      degreeType: scholar?.specialist?.[0].degreeType ?? "",
      specialist: scholar?.specialist?.[0].specialist ?? "",
      about: scholar?.specialist?.[0].about ?? "",
    },
  });

  useEffect(() => {
    if (scholar) {
      form.reset({
        isAbroad: scholar?.isAbroad ?? false,
        country: scholar?.specialist?.[0].country ?? "",
        universityName: scholar?.specialist?.[0].universityName ?? "",
        degreeType: scholar?.specialist?.[0].degreeType ?? "",
        specialist: scholar?.specialist?.[0].specialist ?? "",
        about: scholar?.specialist?.[0].about ?? "",
      });
    }
  }, [scholar, form]);

  const [assignSpecialist] = useAssignSpecialistsMutation();
  const [markAbroad] = useMarkIsAbroadMutation();
  const [UnMarkAbroad] = useUnMarkIsAbroadMutation();

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (!values && !scholar) return;
      const payload: ScholarSpecialistSetUp = { ...values };
      if (values.isAbroad) {
        toast.promise(markAbroad(scholar?.uuid ?? "").unwrap(), {
          loading: "Marking...",
        });
        toast.promise(
          assignSpecialist({
            scholarUuid: scholar?.uuid ?? "",
            specialistSetups: [payload],
          }).unwrap(),
          {
            loading: "Assigning...",
            success: () => {
              return "Specialist assigned successfully!";
            },
            error: (error) => {
              return `Failed to assign scholar specialist: ${error.message}`;
            },
          }
        );
      } else {
        toast.promise(UnMarkAbroad(scholar?.uuid ?? "").unwrap(), {
          loading: "Un marking...",
        });
      }
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  if (!scholar) return;

  return (
    <Form {...form}>
      <form
        className="border p-5 rounded-md"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="isAbroad"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Scholar Abroad</FormLabel>
                <FormDescription>
                  Enable this option to set up scholar abroad
                </FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <div className="flex flex-col space-y-3 mt-4">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="Korea" type="" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-6">
              <FormField
                control={form.control}
                name="universityName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>University</FormLabel>
                    <FormControl>
                      <Input placeholder="ISTAD" type="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6">
              <FormField
                control={form.control}
                name="degreeType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Degree</FormLabel>
                    <FormControl>
                      <Input placeholder="Master" type="" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-6">
              <FormField
                control={form.control}
                name="specialist"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specialist</FormLabel>
                    <FormControl>
                      <Input placeholder="AI" type="" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="about"
            render={({ field }) => (
              <FormItem>
                <FormLabel>About</FormLabel>
                <FormControl>
                  <Textarea placeholder="" className="resize-none" {...field} />
                </FormControl>
                <FormDescription>
                  Their stroy. e.g ITE Generation 1...
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end" hidden={!form.formState.isDirty}>
            <Button type="submit">Save Abroad</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
