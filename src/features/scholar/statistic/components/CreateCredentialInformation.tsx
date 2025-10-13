"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { ScholarCredentialInformation } from "@/types/scholar";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  username: z.string().min(1),
  email: z.string(),
  password: z.string(),
  cfPassword: z.string(),
});

export default function CreateCredentialInformation({
  data,
  handleSubmit,
  handleOnChange,
}: {
  data?: Partial<ScholarCredentialInformation>;
  handleSubmit: (data: ScholarCredentialInformation) => void;
  handleOnChange: (data: Partial<ScholarCredentialInformation>) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: data ?? {
      username: "",
      email: "",
      password: "",
      cfPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    handleSubmit({ ...values });
  }

  useEffect(() => {
    const subscription = form.watch((values) => {
      handleOnChange(values);
    });
    return () => subscription.unsubscribe();
  }, [form, handleOnChange]);

  return (
    <Form {...form}>
      <form
        id="scholar-credential-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-3xl mx-auto py-10"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="kungsovannda" type="text" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="kungsovannda@gmail.com"
                  type="email"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="********" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cfPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="********" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
