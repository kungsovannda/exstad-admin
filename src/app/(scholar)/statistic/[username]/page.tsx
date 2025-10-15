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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useGetScholarByUsernameQuery } from "@/features/scholar/scholarApi";
import ScholarCareerSetUp from "@/features/scholar/statistic/components/ScholarCareerSetUp";
import { useGetAllUniversitiesQuery } from "@/features/university/universityApi";
import { UpdateScholar } from "@/types/scholar";
import { dateFormatter } from "@/utils/dateFormatter";
import { Clock, User } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function ScholarDetails() {
  const param = useParams();
  const username = param.username as string;
  // const scholar = scholars.find((s) => s.username === param.username);
  const { data: scholar } = useGetScholarByUsernameQuery(username, {
    skip: !username,
  });
  const [updateScholar, setUpdateScholar] = useState<UpdateScholar | null>(
    null
  );

  const { data: universities } = useGetAllUniversitiesQuery();
  const { data: provinces } = useGetAllProvincesQuery();
  const { data: currentAddresses } = useGetCurrentAddressesQuery();
  const { data: achievements } = useGetAllScholarAchievementsQuery(
    { scholarUuid: scholar?.uuid ?? "" },
    { skip: !scholar?.uuid }
  );

  const [isAssignBadgeModalOpen, setIsAssignBadgeModalOpen] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  return (
    <div className="pl-6 flex flex-col space-y-4">
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
                  defaultChecked={isEditable}
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
            <div className="flex w-full space-x-2.5">
              <div className="w-full flex flex-col space-y-2">
                <Label>Khmer Name</Label>
                <Input
                  readOnly={!isEditable}
                  className="text-muted-foreground"
                  value={scholar?.khmerName}
                />
              </div>
              <div className="w-full flex flex-col space-y-2">
                <Label>English Name</Label>
                <Input
                  readOnly={!isEditable}
                  className="text-muted-foreground"
                  value={scholar?.englishName}
                />
              </div>
            </div>
            <div className="w-full flex flex-col space-y-2">
              <Label>Username</Label>
              <Input
                disabled
                className="text-muted-foreground"
                value={scholar?.username}
              />
            </div>
            <div className="w-full flex flex-col space-y-2">
              <Label>Email</Label>
              <Input
                disabled
                className="text-muted-foreground"
                value={scholar?.email}
              />
            </div>
            <div className="w-full flex flex-col space-y-2">
              <Label>Bio</Label>
              <Input
                readOnly={!isEditable}
                onChange={(e) =>
                  setUpdateScholar({ ...updateScholar, bio: e.target.value })
                }
                value={scholar?.bio}
              />
            </div>
            <div className="w-full flex flex-col space-y-2">
              <Label>Quote</Label>
              <Input
                readOnly={!isEditable}
                onChange={(e) =>
                  setUpdateScholar({ ...updateScholar, quote: e.target.value })
                }
                value={scholar?.quote}
              />
            </div>
            <div className="w-full flex flex-col space-y-2">
              <Label>University</Label>
              <Select defaultValue={scholar?.university}>
                <SelectTrigger disabled={!isEditable} className="h-11">
                  <SelectValue placeholder="Select a university" />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  <Command>
                    <CommandInput
                      placeholder="Search universities..."
                      className="h-9"
                    />
                    <CommandList>
                      <ScrollArea className="h-72">
                        <CommandEmpty>No university found.</CommandEmpty>
                        <CommandGroup>
                          {universities
                            ?.filter((x) => x.englishName)
                            .map((option) => (
                              <CommandItem
                                key={option.uuid}
                                value={option.englishName}
                                className="cursor-pointer"
                              >
                                <SelectItem
                                  className="h-6"
                                  value={option.englishName}
                                >
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
            </div>
            <div className="w-full flex flex-col space-y-2">
              <Label>Current Address</Label>
              <Select defaultValue={scholar?.currentAddress}>
                <SelectTrigger disabled={!isEditable} className="h-11">
                  <SelectValue placeholder="Select a university" />
                </SelectTrigger>
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
                                className="cursor-pointer"
                              >
                                <SelectItem
                                  className="h-6"
                                  value={option.englishName}
                                >
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
            </div>
            <div className="w-full flex flex-col space-y-2">
              <Label>Province</Label>
              <Select defaultValue={scholar?.province}>
                <SelectTrigger disabled={!isEditable} className="h-11">
                  <SelectValue placeholder="Select a province" />
                </SelectTrigger>
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
                                className="cursor-pointer"
                              >
                                <SelectItem
                                  className="h-6"
                                  value={option.englishName}
                                >
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
            </div>
            {/* <div className="w-full flex flex-col space-y-2">
              <Label>Badges</Label>
              <div className="flex gap-2 items-center">
                {scholar?.badges.length ? (
                  <div className="flex flex-wrap gap-2">
                    {scholar.badges.map((badge) => (
                      <Badge key={badge.uuid} variant="default">
                        {badge.badge.title}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No badges earned
                  </p>
                )}
                <Button
                  onClick={() => setIsAssignBadgeModalOpen(true)}
                  size={"sm"}
                  variant="outline"
                >
                  Add Badge
                </Button>
              </div>
            </div> */}
            <div
              hidden={!isEditable}
              className="flex gap-2 justify-end items-center"
            >
              <Button disabled={updateScholar == null}>Save Changes</Button>
            </div>

            <ScholarCareerSetUp />

            <div className="flex items-center mt-10 justify-between">
              <Heading
                title="Scholar Award"
                description="Note: Changes to this achievement will update the scholar’s profile accordingly."
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
