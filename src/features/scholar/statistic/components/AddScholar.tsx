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
import {
  CreateScholar,
  ScholarCredentialInformation,
  ScholarGeneralInformation,
  toGender,
} from "@/types/scholar";
import { useState } from "react";
import CreateCredentialInformation from "./CreateCredentialInformation";
import CreateGeneralInformation from "./CreateGeneralInformation";
import { useCreateScholarMutation } from "../../scholarApi";
import { toast } from "sonner";

export default function AddScholar({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (status: boolean) => void;
}) {
  const [info, setInfo] = useState("general");
  const [isOpen, setIsOpen] = useState(open);
  const [generalData, setGeneralData] =
    useState<ScholarGeneralInformation | null>(null);
  const [credentialData, setCredentialData] = useState<
    Partial<ScholarCredentialInformation>
  >({});

  const [createScholar] = useCreateScholarMutation();

  const handleNext = (data: ScholarGeneralInformation) => {
    setGeneralData(data);
    setInfo("credential");
  };

  const handleSubmit = (data: ScholarCredentialInformation) => {
    setCredentialData(data);
    if (!generalData) return;
    const scholar: CreateScholar = {
      ...data,
      ...generalData,
      gender: toGender(generalData.gender.toLowerCase()),
      isPublic: generalData.isPublic ?? true,
    };
    console.log(scholar);
    toast.promise(createScholar(scholar).unwrap(), {
      loading: "Creating...",
      success: () => {
        setIsOpen(false);
        return "Scholar created successfully!";
      },
      error: (error) => {
        setIsOpen(false);
        return `Failed to create scholar: ${error.message}`;
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
                className={`flex justify-center  items-center space-x-2 ${
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
                className={`flex justify-center  items-center space-x-2 ${
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
                <CreateGeneralInformation
                  data={generalData ?? undefined}
                  handleOnSubmit={handleNext}
                />
              </TabsContent>
              <TabsContent value="credential">
                <CreateCredentialInformation
                  handleOnChange={setCredentialData}
                  data={credentialData ?? undefined}
                  handleSubmit={handleSubmit}
                />
              </TabsContent>
            </Tabs>
            <DrawerFooter className="mx-auto flex flex-row justify-end items-start w-full px-0 max-w-3xl">
              <DrawerClose className={info === "general" ? "" : "hidden"}>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
              <Button
                className={info === "general" ? "" : "hidden"}
                form="scholar-general-information-form"
                type="submit"
              >
                Next
              </Button>
              <Button
                onClick={() => setInfo("general")}
                className={info === "general" ? "hidden" : ""}
                variant={"outline"}
              >
                Previous
              </Button>
              <Button
                className={info === "general" ? "hidden" : ""}
                form="scholar-credential-form"
                type="submit"
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
