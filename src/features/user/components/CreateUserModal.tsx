"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { PasswordInput } from "@/components/ui/password-input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toGender } from "@/types/scholar";
import { CreateUser, toRole } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useCreateUserMutation } from "../userApi";
import { cn } from "@/lib/utils";

// ✅ Same Zod schema — untouched
const formSchema = z
  .object({
    englishName: z
      .string({ error: "English name is required" })
      .min(2, { message: "English name must be at least 2 characters." })
      .regex(/^[A-Za-z\s]+$/, {
        message: "English name should contain only letters and spaces.",
      }),
    khmerName: z
      .string({ error: "Khmer name is required" })
      .min(2, { message: "Khmer name must be at least 2 characters." }),
    gender: z.enum(["MALE", "FEMALE", "OTHER"], {
      error: "Please select a gender",
    }),
    dob: z.date({ error: "Pick a date" }),
    role: z.enum(["INSTRUCTOR1", "INSTRUCTOR2", "ADMIN"], {
      error: "Please select a role",
    }),
    username: z
      .string({ error: "Username is required" })
      .min(3, { message: "Username must be at least 3 characters." })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message: "Username can only contain letters, numbers, and underscores.",
      }),
    email: z
      .string({ error: "Email is required" })
      .email({ message: "Please enter a valid email address." }),
    password: z
      .string({ error: "Password is required" })
      .min(8, { message: "Password must be at least 8 characters long." })
      .regex(/[A-Z]/, {
        message: "Must include at least one uppercase letter.",
      })
      .regex(/[0-9]/, { message: "Must include at least one number." })
      .regex(/[^A-Za-z0-9]/, {
        message: "Must include at least one special character.",
      }),
    cfPassword: z.string({ error: "Confirm password is required" }),
  })
  .refine((data) => data.password === data.cfPassword, {
    message: "Passwords do not match.",
    path: ["cfPassword"],
  });

export default function CreateUserModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  // 👇 track which tab is active
  const [tab, setTab] = useState("general");

  // 👇 watch for errors and switch to the tab that contains the first invalid field
  useEffect(() => {
    const errors = form.formState.errors;

    if (Object.keys(errors).length > 0) {
      const generalFields = ["englishName", "khmerName", "role"];
      const credentialFields = ["username", "email", "password", "cfPassword"];

      for (const field of Object.keys(errors)) {
        if (generalFields.includes(field)) {
          setTab("general");
          return;
        }
        if (credentialFields.includes(field)) {
          setTab("credentials");
          return;
        }
      }
    }
  }, [form.formState.errors]);

  const [createUser] = useCreateUserMutation();

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values) return;
    try {
      const payload: CreateUser = {
        ...values,
        gender: toGender(values.gender),
        role: toRole(values.role),
        dob: values.dob.toISOString(),
      };
      toast.promise(createUser(payload).unwrap(), {
        loading: "Creating...",
        success: () => {
          return "User created successfully!";
        },
        error: (error) => {
          return `Failed to create user: ${error.message}`;
        },
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) form.reset();
        onOpenChange(isOpen);
      }}
    >
      <DialogContent
        className="sm:max-w-[480px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new user account.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            id="create-user-form"
            className="space-y-4"
          >
            {/* === Tabs Section === */}
            <Tabs value={tab} onValueChange={setTab} className="w-full">
              <TabsList className="grid grid-cols-2 w-full mb-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="credentials">Credentials</TabsTrigger>
              </TabsList>

              {/* === GENERAL TAB === */}
              <TabsContent value="general" className="space-y-4">
                <FormField
                  control={form.control}
                  name="englishName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>English Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Kung Sovannda" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="khmerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Khmer Name</FormLabel>
                      <FormControl>
                        <Input placeholder="គង់ សុវណ្ណដា" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of birth</FormLabel>
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
                            captionLayout="dropdown"
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex gap-5 pt-1"
                        >
                          {[
                            ["Instructor I", "INSTRUCTOR1"],
                            ["Instructor II", "INSTRUCTOR2"],
                            ["Admin", "ADMIN"],
                          ].map(([label, value]) => (
                            <div
                              key={value}
                              className="flex items-center space-x-2"
                            >
                              <RadioGroupItem
                                className="cursor-pointer"
                                id={`role_${value}`}
                                value={value}
                              />
                              <FormLabel
                                htmlFor={`role_${value}`}
                                className="font-normal cursor-pointer"
                              >
                                {label}
                              </FormLabel>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              {/* === CREDENTIALS TAB === */}
              <TabsContent value="credentials" className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="kungsovannda" {...field} />
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
              </TabsContent>
            </Tabs>
          </form>
        </Form>

        {/* === Footer Buttons === */}
        <DialogFooter className="flex justify-end pt-4">
          <DialogClose asChild>
            <Button variant="outline" className="min-w-[90px]">
              Cancel
            </Button>
          </DialogClose>
          <Button
            form="create-user-form"
            type="submit"
            className="min-w-[90px]"
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
