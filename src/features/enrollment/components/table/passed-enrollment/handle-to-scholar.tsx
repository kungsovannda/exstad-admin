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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateMultipleScholarsMutation } from "@/features/scholar/scholarApi";
import { exportToExcel } from "@/services/export-to-excel";
import { Enrollment } from "@/types/enrollment";
import { CreateScholar, toGender } from "@/types/scholar";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, RefreshCw } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

interface HandleToScholarProps {
  open: boolean;
  onOpenChange: (status: boolean) => void;
  enrollment: Enrollment[];
}

const generatePassword = (length: number = 12): string => {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = "0123456789";
  const specialChars = "@$!%*?&";

  const password = [
    lowercase[Math.floor(Math.random() * lowercase.length)],
    uppercase[Math.floor(Math.random() * uppercase.length)],
    digits[Math.floor(Math.random() * digits.length)],
    specialChars[Math.floor(Math.random() * specialChars.length)],
  ];

  const allChars = lowercase + uppercase + digits + specialChars;
  for (let i = password.length; i < length; i++) {
    password.push(allChars[Math.floor(Math.random() * allChars.length)]);
  }

  return password.sort(() => Math.random() - 0.5).join("");
};

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

const formatDobForUsername = (dob: string): string => {
  const date = new Date(dob);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);

  return `${day}${month}${year}`;
};

export function HandleToScholar({
  enrollment,
  open,
  onOpenChange,
}: HandleToScholarProps) {
  const isSingleEnrollment = enrollment.length === 1;

  const schema = z.object({
    passwordMode: z.enum(["CUSTOMIZE", "GENERATE"], {
      error: "Please select password mode",
    }),
    password: z.string().optional(),
    cfPassword: z.string().optional(),
    options: isSingleEnrollment
      ? z.enum(["EACH", "ALL"]).optional()
      : z.enum(["EACH", "ALL"], {
          error: "Please select an option",
        }),
  });

  const finalSchema = schema.superRefine((data, ctx) => {
    if (data.passwordMode === "CUSTOMIZE") {
      if (!data.password) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Password is required",
          path: ["password"],
        });
      } else if (data.password.length < 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Password must be at least 8 characters length",
          path: ["password"],
        });
      } else if (!passwordRegex.test(data.password)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "At least one uppercase letter, one lowercase letter, one number, and one special character",
          path: ["password"],
        });
      }

      if (!data.cfPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Confirm password is required",
          path: ["cfPassword"],
        });
      } else if (data.cfPassword.length < 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Password must be at least 8 characters length",
          path: ["cfPassword"],
        });
      } else if (!passwordRegex.test(data.cfPassword)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "At least one uppercase letter, one lowercase letter, one number, and one special character",
          path: ["cfPassword"],
        });
      }

      if (
        data.password &&
        data.cfPassword &&
        data.password !== data.cfPassword
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Passwords do not match",
          path: ["cfPassword"],
        });
      }
    }
  });

  const form = useForm<z.infer<typeof finalSchema>>({
    resolver: zodResolver(finalSchema),
    defaultValues: {
      passwordMode: "GENERATE",
      password: "",
      cfPassword: "",
      options: isSingleEnrollment ? undefined : ("ALL" as "EACH" | "ALL"),
    },
  });

  const passwordMode = form.watch("passwordMode");

  const handlePasswordModeChange = (mode: "CUSTOMIZE" | "GENERATE") => {
    form.setValue("passwordMode", mode);

    if (mode === "GENERATE") {
      const newPassword = generatePassword(12);
      form.setValue("password", newPassword);
      form.setValue("cfPassword", newPassword);
    } else {
      form.setValue("password", "");
      form.setValue("cfPassword", "");
    }
  };

  const handleRegeneratePassword = () => {
    const newPassword = generatePassword(12);
    form.setValue("password", newPassword);
    form.setValue("cfPassword", newPassword);
    toast.success("Password regenerated!");
  };

  const handleCopyPassword = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Password copied to clipboard!");
  };

  const [createMultipleScholar] = useCreateMultipleScholarsMutation();

  function onSubmit(values: z.infer<typeof finalSchema>) {
    if (!values || !enrollment) return;

    let finalPassword = "";

    if (values.passwordMode === "GENERATE") {
      finalPassword = values.password || generatePassword(12);
    } else {
      finalPassword = values.password || "";
    }

    const createScholar: CreateScholar[] = enrollment.map((e) => {
      const scholarPassword =
        !isSingleEnrollment &&
        values.passwordMode === "GENERATE" &&
        values.options === "EACH"
          ? generatePassword(12)
          : finalPassword;

      return {
        username:
          e.englishName.toLocaleLowerCase().replaceAll(" ", "_") +
          "_" +
          formatDobForUsername(e.dob),
        email: e.email,
        password: scholarPassword,
        cfPassword: scholarPassword,
        phoneNumber: e.phoneNumber,
        englishName: e.englishName,
        khmerName: e.khmerName,
        gender: toGender(e.gender),
        dob: e.dob,
        university: e.university,
        province: e.province,
        currentAddress: e.currentAddress,
        isPublic: true,
        avatar: e.avatar ?? null,
      };
    });

    const selectedFields: string[] = [
      "englishName",
      "khmerName",
      "dob",
      "gender",
      "phoneNumber",
      "university",
      "currentAddress",
      "province",
      "username",
      "email",
      "password",
      "isPublic",
    ];
    exportToExcel({
      data: createScholar,
      selectedFields: selectedFields,
      filename: "enrollment_scholar.xlsx",
    });

    handleCreateScholar(createScholar);
  }

  const handleCreateScholar = (data: CreateScholar[]) => {
    if (!data) return;
    const scholar: CreateScholar[] = data.map((d) => ({
      ...d,
      gender: toGender(d.gender),
      isPublic: true,
    }));
    console.log(scholar);
    toast.promise(createMultipleScholar(scholar).unwrap(), {
      loading: "Creating...",
      success: () => {
        onOpenChange(false);
        form.reset();
        return "Scholar created successfully!";
      },
      error: (error) => {
        return `Failed to create scholar: ${error.message}`;
      },
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) form.reset();
        onOpenChange(isOpen);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enrollment to Scholar</DialogTitle>
          <DialogDescription>
            Config the password setting below to create scholar
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="create-enrollment-to-scholar-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="passwordMode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password Mode</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={handlePasswordModeChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="GENERATE">Generate</SelectItem>
                      <SelectItem value="CUSTOMIZE">Customize</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <div className="relative">
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="********"
                        {...field}
                        readOnly={passwordMode === "GENERATE"}
                        className={
                          passwordMode === "GENERATE" ? "pr-20" : "pr-10"
                        }
                      />
                    </FormControl>
                    <div className="absolute right-0 top-0 h-full flex items-center">
                      {passwordMode === "GENERATE" && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-full px-2 hover:bg-transparent"
                          onClick={handleRegeneratePassword}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-full px-3 hover:bg-transparent"
                        onClick={() => handleCopyPassword(field.value || "")}
                        disabled={!field.value}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
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
                  <div className="relative">
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="********"
                        {...field}
                        readOnly={passwordMode === "GENERATE"}
                        className={
                          passwordMode === "GENERATE" ? "pr-20" : "pr-10"
                        }
                      />
                    </FormControl>
                    <div className="absolute right-0 top-0 h-full flex items-center">
                      {passwordMode === "GENERATE" && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-full px-2 hover:bg-transparent"
                          onClick={handleRegeneratePassword}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-full px-3 hover:bg-transparent"
                        onClick={() => handleCopyPassword(field.value || "")}
                        disabled={!field.value}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!isSingleEnrollment && passwordMode === "GENERATE" && (
              <FormField
                control={form.control}
                name="options"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Option</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex gap-5 pt-1"
                      >
                        {[
                          ["One for each", "EACH"],
                          ["One for all", "ALL"],
                        ].map(([label, value]) => (
                          <div
                            key={value}
                            className="flex items-center space-x-2"
                          >
                            <RadioGroupItem
                              className="cursor-pointer"
                              id={`option_${value}`}
                              value={value}
                            />
                            <FormLabel
                              htmlFor={`option_${value}`}
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
            )}
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button form="create-enrollment-to-scholar-form" type="submit">
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
