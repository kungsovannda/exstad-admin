"use client";
import { Heading } from "@/components/Heading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import AchievementCard from "@/features/achievement/components/AchievementCard";
import BadgeCard from "@/features/badge/components/BadgeCard";
import { useGetCertificateByScholarQuery } from "@/features/certificate/certificateApi";
import CertificateCard from "@/features/certificate/components/CertificateCard";
import { useGetCurrentAddressesQuery } from "@/features/current-address/currentAddressApi";
import { useGetAllProvincesQuery } from "@/features/province/provinceApi";
import { useGetAllScholarAchievementsQuery } from "@/features/scholar-achievement/scholarAchievementApi";
import {
  useGetScholarByUsernameQuery,
  useUpdateScholarMutation,
} from "@/features/scholar/scholarApi";
import CompletedCourseCard from "@/features/scholar/statistic/components/CompletedCourseCard";
import ScholarCareerSetUpComponent from "@/features/scholar/statistic/components/ScholarCareerSetUpComponent";
import ScholarSpecialistSetUpComponent from "@/features/scholar/statistic/components/ScholarSpecialistSetUpComponent";
import { UpdateProfileScholar } from "@/features/scholar/statistic/components/UpdateProfileScholar";
import { useGetAllUniversitiesQuery } from "@/features/university/universityApi";
import { UpdateScholar } from "@/types/scholar";
import { toScholarStatus } from "@/types/scholar/scholar-status";
import { dateFormatter } from "@/utils/dateFormatter";
import { zodResolver } from "@hookform/resolvers/zod";
import { Clock, Pencil, User } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "ACTIVE" },
  { value: "SUSPENDED", label: "SUSPENDED" },
  { value: "GRADUATED", label: "GRADUATED" },
  { value: "DROPPED", label: "DROPPED" },
];

const getStatusBorderClass = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return " border-green-500 ring-green-500/20";
    case "GRADUATED":
      return "border-blue-500 ring-blue-500/20";
    case "SUSPENDED":
      return "border-yellow-500 ring-yellow-500/20";
    case "DROPPED":
      return "border-red-500 ring-red-500/20";
    default:
      return "border-2 border-blue-300 animate-pulse";
  }
};

const formSchema = z.object({
  status: z.string().optional(),
  bio: z.string().optional(),
  quote: z.string().optional(),
  university: z.string().optional(),
  currentAddress: z.string().optional(),
  province: z.string().optional(),
  isPublic: z.boolean().optional(),
  nickname: z.string().optional(),
  phoneFamilyNumber: z.string().optional(),
});

export default function ScholarDetails() {
  const param = useParams();
  const username = param.username as string;

  const { data: scholar } = useGetScholarByUsernameQuery(username, {
    skip: !username,
    refetchOnMountOrArgChange: true,
  });

  const [updateScholar] = useUpdateScholarMutation();
  const { data: universities } = useGetAllUniversitiesQuery();
  const { data: provinces } = useGetAllProvincesQuery();
  const { data: currentAddresses } = useGetCurrentAddressesQuery();
  const { data: achievements } = useGetAllScholarAchievementsQuery(
    { scholarUuid: scholar?.uuid ?? "" },
    { skip: !scholar?.uuid }
  );
  const { data: certificates } = useGetCertificateByScholarQuery(
    { scholarUuid: scholar?.uuid ?? "" },
    { skip: !scholar?.uuid }
  );

  const [isEditable, setIsEditable] = useState(false);
  const [isUpdateProfileOpen, setIsUpdateProfileOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  useEffect(() => {
    if (scholar) {
      form.reset({
        bio: scholar.bio || "",
        quote: scholar.quote || "",
        isPublic: scholar.isPublic,
        nickname: scholar.nickname || "",
        phoneFamilyNumber: scholar.phoneFamilyNumber || "",
        status: scholar.status || "",
        university: scholar.university || "",
        currentAddress: scholar.currentAddress || "",
        province: scholar.province || "",
      });
    }
  }, [scholar, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!scholar?.uuid) return;

    const dirtyFields = form.formState.dirtyFields;
    const payload: Record<string, unknown> = {};

    Object.keys(dirtyFields).forEach((key) => {
      const fieldKey = key as keyof typeof values;
      const value = values[fieldKey];

      if (value !== undefined && value !== null && value !== "") {
        if (fieldKey === "status") {
          payload.status = toScholarStatus(value as string);
        } else {
          payload[fieldKey] = value;
        }
      }
    });

    toast.promise(
      updateScholar({
        uuid: scholar.uuid,
        body: payload as Partial<UpdateScholar>,
      }).unwrap(),
      {
        loading: "Updating scholar...",
        success: () => {
          setIsEditable(false);
          return "Scholar updated successfully!";
        },
        error: (error) => {
          return `Failed to update scholar: ${error.message}`;
        },
      }
    );
  }

  return (
    <div className="pl-6 h-content max-h-content overflow-hidden flex flex-col space-y-4">
      <main className="grid grid-cols-[0.3fr_0.7fr] gap-4">
        {/* Left Content */}
        <div className="h-content max-h-content border-r-1 flex flex-col space-y-3 justify-start items-center pr-6 pb-6 pt-6">
          <Avatar className="rounded-full overflow-visible relative border-1 w-2/3 h-fit aspect-square">
            <AvatarImage
              className="rounded-full h-full w-full object-cover"
              src={scholar?.avatar || "/placeholder.svg"}
              alt={`Avatar of ${scholar?.englishName}`}
            />
            <AvatarFallback className="text-3xl border-none">
              {scholar?.englishName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
            <label
              onClick={() => setIsUpdateProfileOpen(true)}
              className="absolute bottom-2 left-2 h-10 w-10 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors shadow-lg border-2 border-background"
            >
              <Pencil className="h-4 w-4 text-primary-foreground" />
            </label>
          </Avatar>
          <div className="text-center flex flex-col space-y-1 items-center justify-center">
            <div className="text-2xl">
              {scholar?.englishName} - {scholar?.khmerName}
            </div>
            <p className="text-muted-foreground">{scholar?.email}</p>
            <Badge variant={"secondary"}>{scholar?.gender}</Badge>
          </div>

          <div className="w-full h-full justify-between space-y-2 flex flex-col text-sm text-muted-foreground">
            <div className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="w-full flex justify-between">
                  <span className="text-muted-foreground">English Name:</span>
                  <p className="font-medium">{scholar?.englishName || "N/A"}</p>
                </div>
                <div className="w-full flex justify-between">
                  <span className="text-muted-foreground">Khmer Name:</span>
                  <p className="font-medium">{scholar?.khmerName || "N/A"}</p>
                </div>
                <div className="w-full flex justify-between">
                  <span className="text-muted-foreground">Gender:</span>
                  <p className="font-medium capitalize">
                    {scholar?.gender || "N/A"}
                  </p>
                </div>
                <div className="w-full flex justify-between">
                  <span className="text-muted-foreground">Date of Birth:</span>
                  <p className="font-medium">{scholar?.dob || "N/A"}</p>
                </div>
                <div className="w-full flex justify-between">
                  <span className="text-muted-foreground">Username:</span>
                  <p className="font-medium ">{scholar?.username || "N/A"}</p>
                </div>
                <div className="w-full flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <p className="font-medium ">{scholar?.email || "N/A"}</p>
                </div>
                <div className="w-full flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <p className="font-medium ">
                    {scholar?.phoneNumber || "N/A"}
                  </p>
                </div>
              </div>
            </div>
            <Separator />
            <div className="flex flex-col text-sm space-y-2">
              <div className="w-full flex justify-between">
                <div className="flex items-center space-x-1 ">
                  <User size={14} />
                  <span>Created By:</span>
                </div>
                <p>{scholar?.audit.createdBy ?? "N/A"}</p>
              </div>
              <div className="w-full flex justify-between">
                <div className="flex items-center space-x-1">
                  <Clock size={14} />
                  <span>Created At:</span>
                </div>
                <p>{dateFormatter(scholar?.audit.createdAt)}</p>
              </div>
              <div className="w-full flex justify-between">
                <div className="flex items-center space-x-1">
                  <User size={14} />
                  <span>Updated By:</span>
                </div>
                <p>{scholar?.audit.updatedBy ?? "N/A"}</p>
              </div>
              <div className="w-full flex justify-between">
                <div className="flex items-center space-x-1">
                  <Clock size={14} />
                  <span>Updated At:</span>
                </div>
                <p>{dateFormatter(scholar?.audit.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right content */}
        <ScrollArea
          scrollHideDelay={0}
          className="pl-2 pr-6 h-content max-h-content"
        >
          <div className="py-6 space-y-5">
            <div className="flex items-center justify-between">
              <Heading
                title="Scholar Profile"
                description="Note: Anything changes will affect the scholar's profile."
              />
              <Button className="flex items-center" variant={"outline"}>
                <Checkbox
                  checked={isEditable}
                  onCheckedChange={() => setIsEditable(!isEditable)}
                  className="cursor-pointer"
                  id="enable-edit"
                />
                <label className="cursor-pointer" htmlFor={"enable-edit"}>
                  Enable Edit
                </label>
              </Button>
            </div>
            <Separator />

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="status"
                  disabled={!isEditable}
                  render={({ field }) => (
                    <FormItem
                      className={`flex items-center justify-between space-x-4 p-4 rounded-lg transition-colors duration-200 border-2 ${getStatusBorderClass(
                        field.value ?? ""
                      )}`}
                    >
                      <div className="flex-1 space-y-1">
                        <FormLabel className="text-sm font-medium">
                          Scholar Status
                        </FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Current status in the scholarship program (e.g.,
                          Active, Graduated).
                        </p>
                        <FormMessage />
                      </div>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!isEditable}
                      >
                        <SelectTrigger className="h-11 w-[150px]">
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nickname"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Nickname</FormLabel>
                      <FormControl>
                        <Input
                          readOnly={!isEditable}
                          className={!isEditable ? "text-muted-foreground" : ""}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneFamilyNumber"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start">
                      <FormLabel>Family Phone Number</FormLabel>
                      <FormControl className="w-full">
                        <PhoneInput
                          readOnly={!isEditable}
                          className={!isEditable ? "text-muted-foreground" : ""}
                          placeholder="Placeholder"
                          {...field}
                          defaultCountry="KH"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* bio field: Kept, as it's in the schema. */}
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Input readOnly={!isEditable} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* quote field: Kept, as it's in the schema. */}
                <FormField
                  control={form.control}
                  name="quote"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quote</FormLabel>
                      <FormControl>
                        <Input readOnly={!isEditable} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* university field: Kept, as it's in the schema. */}
                <FormField
                  control={form.control}
                  name="university"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>University</FormLabel>
                      <Select
                        disabled={!isEditable}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select a university" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-80">
                          <Command>
                            <CommandInput
                              placeholder="Search universities..."
                              className="h-9"
                            />
                            <CommandList>
                              <ScrollArea className="h-72">
                                <CommandEmpty>
                                  No university found.
                                </CommandEmpty>
                                <CommandGroup>
                                  {universities
                                    ?.filter((x) => x.englishName)
                                    .map((option) => (
                                      // Changed CommandItem to wrap SelectItem content
                                      <CommandItem
                                        key={option.uuid}
                                        value={option.englishName}
                                        onSelect={() =>
                                          field.onChange(option.englishName)
                                        }
                                        className="cursor-pointer"
                                      >
                                        {option.englishName}
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

                {/* currentAddress field: Kept, as it's in the schema. */}
                <FormField
                  control={form.control}
                  name="currentAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Address</FormLabel>
                      <Select
                        disabled={!isEditable}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select an address" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-80">
                          <Command>
                            <CommandInput
                              placeholder="Search addresses..."
                              className="h-9"
                            />
                            <CommandList>
                              <ScrollArea className="h-72">
                                <CommandEmpty>No address found.</CommandEmpty>
                                <CommandGroup>
                                  {currentAddresses
                                    ?.filter((x) => x.englishName)
                                    .map((option) => (
                                      // Changed CommandItem to wrap SelectItem content
                                      <CommandItem
                                        key={option.uuid}
                                        value={option.englishName}
                                        onSelect={() =>
                                          field.onChange(option.englishName)
                                        }
                                        className="cursor-pointer"
                                      >
                                        {option.englishName}
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

                {/* province field: Kept, as it's in the schema. */}
                <FormField
                  control={form.control}
                  name="province"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Province</FormLabel>
                      <Select
                        disabled={!isEditable}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select a province" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-80">
                          <Command>
                            <CommandInput
                              placeholder="Search provinces..."
                              className="h-9"
                            />
                            <CommandList>
                              <ScrollArea className="h-72">
                                <CommandEmpty>No province found.</CommandEmpty>
                                <CommandGroup>
                                  {provinces
                                    ?.filter((x) => x.englishName)
                                    .map((option) => (
                                      // Changed CommandItem to wrap SelectItem content
                                      <CommandItem
                                        key={option.uuid}
                                        value={option.englishName}
                                        onSelect={() =>
                                          field.onChange(option.englishName)
                                        }
                                        className="cursor-pointer"
                                      >
                                        {option.englishName}
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

                {/* New: isPublic checkbox (Added, as it's in the schema) */}
                <FormField
                  control={form.control}
                  name="isPublic"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          disabled={!isEditable}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-2 leading-none">
                        <FormLabel>Public</FormLabel>
                        <FormDescription>
                          This is the visibility of scholars profile
                        </FormDescription>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                {/* Buttons: Kept the submission buttons and logic. */}
                <div
                  hidden={!isEditable || !form.formState.isDirty}
                  className="flex gap-2 justify-end items-center"
                >
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      form.reset();
                      setIsEditable(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </Form>

            <Separator />

            <ScholarCareerSetUpComponent scholar={scholar ?? null} />
            <ScholarSpecialistSetUpComponent scholar={scholar ?? null} />

            <div className="flex items-center mt-10 justify-between">
              <Heading
                title="Scholar Award"
                description="Note: Changes to this achievement will update the scholar's profile accordingly."
              />
            </div>
            <Separator />
            <Accordion
              className="px-5 space-y-4 rounded-sm border"
              type="single"
              collapsible
            >
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <div className="flex items-center">
                    <h2 className="text-xl font-semibold">
                      Scholar Completed Courses{" "}
                      <Badge
                        className="text-sm h-full aspect-square rounded-full"
                        variant={"outline"}
                      >{`${scholar?.completedCourses?.length ?? 0}`}</Badge>
                    </h2>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {!scholar?.completedCourses ||
                  scholar?.completedCourses.length === 0 ? (
                    <div className="flex items-center justify-center py-8 text-muted-foreground">
                      No completed course found
                    </div>
                  ) : (
                    <div className="w-full overflow-x-auto overflow-y-hidden pb-2">
                      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                        {scholar.completedCourses.map((a) => (
                          <CompletedCourseCard
                            key={a.uuid}
                            completedCourse={a}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Accordion
              className="px-5 space-y-4 rounded-sm border"
              type="single"
              collapsible
            >
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <div className="flex items-center">
                    <h2 className="text-xl font-semibold">
                      Scholar Certificates{" "}
                      <Badge
                        className="text-sm h-full aspect-square rounded-full"
                        variant={"outline"}
                      >{`${scholar?.completedCourses?.length ?? 0}`}</Badge>
                    </h2>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {!certificates || certificates.length === 0 ? (
                    <div className="flex items-center justify-center py-8 text-muted-foreground">
                      No certificate found
                    </div>
                  ) : (
                    <div className="w-full overflow-x-auto overflow-y-hidden pb-2">
                      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                        {certificates.map((a) => (
                          <CertificateCard key={a.uuid} certificate={a} />
                        ))}
                      </div>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Accordion
              className="px-5 space-y-4 rounded-sm border"
              type="single"
              collapsible
            >
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <div className="flex items-center">
                    <h2 className="text-xl font-semibold">
                      Scholar Achievements{" "}
                      <Badge
                        className="text-sm h-full aspect-square rounded-full"
                        variant={"outline"}
                      >{`${achievements?.length ?? 0}`}</Badge>
                    </h2>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {!achievements || achievements.length === 0 ? (
                    <div className="flex items-center justify-center py-8 text-muted-foreground">
                      No achievements found
                    </div>
                  ) : (
                    <div className="w-full overflow-x-auto overflow-y-hidden pb-2">
                      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                        {achievements.map((a) => (
                          <AchievementCard
                            key={a.uuid}
                            achievement={a.achievement}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Accordion
              className="px-5 space-y-4 rounded-sm border"
              type="single"
              collapsible
            >
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <div className="flex items-center">
                    <h2 className="text-xl font-semibold">
                      Scholar Badges{" "}
                      <Badge
                        className="text-sm h-full aspect-square rounded-full"
                        variant={"outline"}
                      >{`${scholar?.badges?.length ?? 0}`}</Badge>
                    </h2>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {!scholar?.badges || scholar.badges.length === 0 ? (
                    <div className="flex items-center justify-center py-8 text-muted-foreground">
                      No badges found
                    </div>
                  ) : (
                    <div className="w-full overflow-x-auto overflow-y-hidden pb-2">
                      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                        {scholar.badges.map((a) => (
                          <BadgeCard key={a.uuid} badge={a} />
                        ))}
                      </div>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </ScrollArea>
      </main>
      {isUpdateProfileOpen && (
        <UpdateProfileScholar
          open={isUpdateProfileOpen}
          onOpenChange={setIsUpdateProfileOpen}
          scholar={scholar ?? null}
        />
      )}
    </div>
  );
}
