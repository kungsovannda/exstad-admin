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
import { Scholar, ScholarCareerSetUp } from "@/types/scholar";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  useAssignCareersMutation,
  useMarkIsEmployedMutation,
  useUnMarkIsEmployedMutation,
} from "../../scholarApi";
import { useEffect, useState } from "react";

const formSchema = z.object({
  isEmployed: z.boolean(),
  company: z.string().min(1),
  companyType: z.string().min(1),
  position: z.string().min(1),
  salary: z.number(),
  interest: z.string(),
});

export default function ScholarCareerSetUpComponent({
  scholar,
}: {
  scholar: Scholar | null;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isEmployed: scholar?.isEmployed ?? false,
      company: scholar?.careers?.[0].company ?? "",
      companyType: scholar?.careers?.[0].companyType ?? "",
      position: scholar?.careers?.[0].position ?? "",
      salary: scholar?.careers?.[0].salary ?? 0,
      interest: scholar?.careers?.[0].interest ?? "",
    },
  });

  useEffect(() => {
    if (scholar) {
      form.reset({
        isEmployed: scholar?.isEmployed ?? false,
        company: scholar?.careers?.[0].company ?? "",
        companyType: scholar?.careers?.[0].companyType ?? "",
        position: scholar?.careers?.[0].position ?? "",
        salary: scholar?.careers?.[0].salary ?? 0,
        interest: scholar?.careers?.[0].interest ?? "",
      });
    }
  }, [scholar, form]);

  const [assignCareer] = useAssignCareersMutation();
  const [markEmployed] = useMarkIsEmployedMutation();
  const [markUnEmployed] = useUnMarkIsEmployedMutation();

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (!values && !scholar) return;
      const payload: ScholarCareerSetUp = { ...values };
      if (values.isEmployed) {
        toast.promise(markEmployed(scholar?.uuid ?? "").unwrap(), {
          loading: "Marking...",
        });
        toast.promise(
          assignCareer({
            scholarUuid: scholar?.uuid ?? "",
            careerSetups: [payload],
          }).unwrap(),
          {
            loading: "Assigning...",
            success: () => {
              return "Career assigned successfully!";
            },
            error: (error) => {
              return `Failed to assign scholar careers: ${error.message}`;
            },
          }
        );
      } else {
        toast.promise(markUnEmployed(scholar?.uuid ?? "").unwrap(), {
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
          name="isEmployed"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Scholar Career</FormLabel>
                <FormDescription>
                  Enable this option to set up your scholar careers.
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
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input placeholder="ISTAD" type="" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-6">
              <FormField
                control={form.control}
                name="companyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Type</FormLabel>
                    <FormControl>
                      <Input placeholder="Institute" type="" {...field} />
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
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Software Developer"
                        type=""
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-6">
              <FormField
                control={form.control}
                name="salary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salary</FormLabel>
                    <FormControl>
                      <Input
                        placeholder=""
                        type="number"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value)
                          )
                        }
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="interest"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interest</FormLabel>
                <FormControl>
                  <Textarea placeholder="" className="resize-none" {...field} />
                </FormControl>
                <FormDescription>Their interest about ISTAD</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end" hidden={!form.formState.isDirty}>
            <Button type="submit">Save Career</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
