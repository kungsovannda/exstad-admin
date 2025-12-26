import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { CreateScholar, toGender } from "@/types/scholar";
import { useEffect, useState } from "react";
import CreateCredentialInformation from "./CreateCredentialInformation";
import CreateGeneralInformation from "./CreateGeneralInformation";
import { useCreateScholarMutation } from "../../scholarApi";
import { toast } from "sonner";
import { useCreateDocumentMutation } from "@/features/document/documentApi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

export const scholarFormSchema = z
  .object({
    // General Information
    englishName: z
      .string({ error: "English name is required" })
      .min(5, { message: "English name must be at least 5 characters." })
      .max(100, { message: "English name must be at most 100 characters." }),
    khmerName: z
      .string({ error: "Khmer name is required" })
      .min(5, { message: "Khmer name must be at least 5 characters." })
      .max(100, { message: "Khmer name must be at most 100 characters." }),
    gender: z.string({ error: "Please select a gender" }),
    dob: z
      .date({ error: "Date of birth is required" })
      .max(new Date(), { error: "Date of birth must be in the past" }),
    phoneNumber: z.string({ error: "Phone number is required" }),
    phoneFamilyNumber: z.string({ error: "Family phone number is required" }),
    university: z.string({ error: "Please select a university" }),
    province: z.string({ error: "Please select a province" }),
    currentAddress: z.string({ error: "Please select a current address" }),
    isPublic: z.boolean().optional(),
    avatar: z.instanceof(File).optional(),

    // Credential Information
    username: z.string({ error: "Username is required" }).min(1, {
      message: "Username must be at least 1 character",
    }),
    email: z.string({ error: "Email is required" }).email({
      message: "Please enter a valid email address",
    }),
    password: z
      .string({ error: "Password is required" })
      .min(8, { message: "Password must be at least 8 characters length" })
      .regex(
        passwordRegex,
        "At least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    cfPassword: z
      .string({ error: "Confirm password is required" })
      .min(8, { message: "Password must be at least 8 characters length" })
      .regex(
        passwordRegex,
        "At least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
  })
  .refine((data) => data.password === data.cfPassword, {
    message: "Passwords do not match",
    path: ["cfPassword"],
  });

export type ScholarFormValues = z.infer<typeof scholarFormSchema>;

export default function AddScholar({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (status: boolean) => void;
}) {
  const [info, setInfo] = useState("general");
  const [isOpen, setIsOpen] = useState(open);

  const [createScholar, { isError, error }] = useCreateScholarMutation();
  const [createDocument] = useCreateDocumentMutation();

  const form = useForm<ScholarFormValues>({
    resolver: zodResolver(scholarFormSchema),
    defaultValues: {
      dob: new Date(),
      isPublic: true,
    },
    mode: "onChange",
    reValidateMode: "onChange",
    criteriaMode: "all",
  });

  const handleNext = async () => {
    // Validate general information fields
    const generalFields: (keyof ScholarFormValues)[] = [
      "englishName",
      "khmerName",
      "gender",
      "dob",
      "phoneNumber",
      "phoneFamilyNumber",
      "university",
      "province",
      "currentAddress",
    ];

    const isValid = await form.trigger(generalFields);

    if (isValid) {
      setInfo("credential");
    }
  };

  const handleSubmit = async (values: ScholarFormValues) => {
    if (values.cfPassword !== values.password) {
      toast.error("Password did not match!");
      return;
    }

    let avatarUri;
    if (values.avatar) {
      toast.loading("Uploading avatar...");
      try {
        const document = await createDocument({
          file: values.avatar,
          documentType: "avatar",
          gen: 0,
          programSlug: "null",
        }).unwrap();
        avatarUri = document.uri;
        toast.dismiss();
      } catch (error) {
        toast.dismiss();
        toast.error("Failed to upload avatar");
        return;
      }
    }

    const { avatar, dob, ...otherValues } = values;

    const scholar: CreateScholar = {
      ...otherValues,
      avatar: avatarUri,
      dob: dob.toISOString(),
      gender: toGender(values.gender.toLowerCase()),
      isPublic: values.isPublic ?? true,
    };

    toast.promise(createScholar(scholar).unwrap(), {
      loading: "Creating...",
      success: () => {
        setIsOpen(false);
        onOpenChange(false);
        form.reset();
        return "Scholar created successfully!";
      },
      error: (error) => {
        const errorMessage =
          error?.error?.description || "Failed to create scholar";
        console.log("Error message:", errorMessage);
        return errorMessage;
      },
    });
  };

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="h-screen min-h-screen">
        <DrawerHeader className="mx-auto max-w-3xl mt-4">
          <DrawerTitle>
            <ul className="flex justify-center items-center space-x-4">
              <li
                className={`flex justify-center items-center space-x-2 ${
                  info === "general"
                    ? "text-primary border-primary"
                    : "text-secondary border-secondary"
                }`}
              >
                <span className="flex justify-center border-inherit items-center h-11 aspect-square border-1 rounded-full">
                  1
                </span>
                <span className="text-md text-nowrap">General Information</span>
              </li>

              <li className="w-32">
                <Separator orientation="horizontal" />
              </li>
              <li
                className={`flex justify-center items-center space-x-2 ${
                  info === "credential"
                    ? "text-primary border-primary"
                    : "text-secondary border-inherit"
                }`}
              >
                <span className="flex justify-center border-inherit items-center h-11 aspect-square border-1 rounded-full">
                  2
                </span>
                <span className="text-md text-nowrap">
                  Credential Information
                </span>
              </li>
            </ul>
          </DrawerTitle>
        </DrawerHeader>
        <ScrollArea className="h-[calc(100%-8rem)]">
          <div className="pb-10 overflow-hidden">
            <Tabs value={info} onValueChange={setInfo} defaultValue={info}>
              <TabsContent value="general">
                <CreateGeneralInformation form={form} />
              </TabsContent>
              <TabsContent value="credential">
                <CreateCredentialInformation form={form} />
              </TabsContent>
            </Tabs>
            <DrawerFooter className="mx-auto flex flex-row justify-end items-start w-full px-0 max-w-3xl">
              <DrawerClose className={info === "general" ? "" : "hidden"}>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
              <Button
                className={info === "general" ? "" : "hidden"}
                onClick={handleNext}
                type="button"
              >
                Next
              </Button>
              <Button
                onClick={() => setInfo("general")}
                className={info === "general" ? "hidden" : ""}
                variant={"outline"}
                type="button"
              >
                Previous
              </Button>
              <Button
                className={info === "general" ? "hidden" : ""}
                onClick={form.handleSubmit(handleSubmit)}
                type="button"
              >
                Submit
              </Button>
            </DrawerFooter>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
