"use client";
import { Heading } from "@/components/Heading";
import { AssignBadgeScholar } from "@/components/scholar/AssignBadgeScholar";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import { useGetCurrentAddressesQuery } from "@/features/current-address/currentAddressApi";
import { useGetAllProvincesQuery } from "@/features/province/provinceApi";
import { useGetAllScholarAchievementsQuery } from "@/features/scholar-achievement/scholarAchievementApi";
import {
  useGetScholarByUsernameQuery,
  useUpdateScholarMutation,
} from "@/features/scholar/scholarApi";
import ScholarCareerSetUpComponent from "@/features/scholar/statistic/components/ScholarCareerSetUpComponent";
import ScholarSpecialistSetUpComponent from "@/features/scholar/statistic/components/ScholarSpecialistSetUpComponent";
import { useGetAllUniversitiesQuery } from "@/features/university/universityApi";
import { dateFormatter } from "@/utils/dateFormatter";
import { zodResolver } from "@hookform/resolvers/zod";
import { Clock, User } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  khmerName: z.string().min(1, "Khmer name is required"),
  englishName: z.string().min(1, "English name is required"),
  bio: z.string().optional(),
  quote: z.string().optional(),
  university: z.string().optional(),
  currentAddress: z.string().optional(),
  province: z.string().optional(),
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

  const [isAssignBadgeModalOpen, setIsAssignBadgeModalOpen] = useState(false);
  const [isEditable, setIsEditable] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      khmerName: "",
      englishName: "",
      bio: "",
      quote: "",
      university: "",
      currentAddress: "",
      province: "",
    },
  });

  // Reset form when scholar data loads
  useEffect(() => {
    if (scholar) {
      form.reset({
        khmerName: scholar.khmerName || "",
        englishName: scholar.englishName || "",
        bio: scholar.bio || "",
        quote: scholar.quote || "",
        university: scholar.university || "",
        currentAddress: scholar.currentAddress || "",
        province: scholar.province || "",
      });
    }
  }, [scholar, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!scholar?.uuid) return;

    toast.promise(
      updateScholar({
        uuid: scholar.uuid,
        body: values,
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
          <Avatar className="rounded-lg border-1 w-2/3 h-fit aspect-square">
            <AvatarImage
              className="rounded-lg h-full w-full object-cover"
              src={scholar?.avatar || "/placeholder.svg"}
              alt={`Avatar of ${scholar?.englishName}`}
            />
            <AvatarFallback className="text-3xl">
              {scholar?.englishName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="text-center flex flex-col space-y-1 items-center justify-center">
            <div className="text-2xl">
              {scholar?.englishName} - {scholar?.khmerName}
            </div>
            <p className="text-muted-foreground">{scholar?.email}</p>
            <Badge variant={"secondary"}>{scholar?.gender}</Badge>
          </div>

          <div className="w-full h-full justify-end space-y-2 flex flex-col text-sm text-muted-foreground">
            <div className="w-full flex justify-between">
              <div className="flex items-center space-x-1">
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
                <div className="flex w-full space-x-2.5">
                  <FormField
                    control={form.control}
                    name="englishName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>English Name</FormLabel>
                        <FormControl>
                          <Input
                            disabled
                            readOnly={!isEditable}
                            className="text-muted-foreground"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="khmerName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Khmer Name</FormLabel>
                        <FormControl>
                          <Input
                            disabled
                            readOnly={!isEditable}
                            className="text-muted-foreground"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <Input
                    disabled
                    className="text-muted-foreground"
                    value={scholar?.username || ""}
                  />
                </FormItem>

                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input
                    disabled
                    className="text-muted-foreground"
                    value={scholar?.email || ""}
                  />
                </FormItem>

                <FormField
                  control={form.control}
                  name="bio"
                  disabled={!isEditable}
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

                <FormField
                  control={form.control}
                  name="quote"
                  disabled={!isEditable}
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
                                      <CommandItem
                                        key={option.uuid}
                                        value={option.englishName}
                                        onSelect={() =>
                                          field.onChange(option.englishName)
                                        }
                                        className="cursor-pointer"
                                      >
                                        <SelectItem value={option.englishName}>
                                          {option.englishName}
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
                                      <CommandItem
                                        key={option.uuid}
                                        value={option.englishName}
                                        onSelect={() =>
                                          field.onChange(option.englishName)
                                        }
                                        className="cursor-pointer"
                                      >
                                        <SelectItem value={option.englishName}>
                                          {option.englishName}
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
                                      <CommandItem
                                        key={option.uuid}
                                        value={option.englishName}
                                        onSelect={() =>
                                          field.onChange(option.englishName)
                                        }
                                        className="cursor-pointer"
                                      >
                                        <SelectItem value={option.englishName}>
                                          {option.englishName}
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
                      Scholar Achievements{" "}
                      <Badge
                        className="text-sm h-full aspect-square rounded-full"
                        variant={"outline"}
                      >{`${achievements?.length}`}</Badge>
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
                      >{`${scholar?.badges?.length}`}</Badge>
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
      {isAssignBadgeModalOpen && (
        <AssignBadgeScholar
          open={isAssignBadgeModalOpen}
          onOpenChange={setIsAssignBadgeModalOpen}
          scholars={[scholar!]}
        />
      )}
    </div>
  );
}
