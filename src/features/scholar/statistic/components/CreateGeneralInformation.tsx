"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { PhoneInput } from "@/components/ui/phone-input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetCurrentAddressesQuery } from "@/features/current-address/currentAddressApi";
import { useGetAllProvincesQuery } from "@/features/province/provinceApi";
import { useGetAllUniversitiesQuery } from "@/features/university/universityApi";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Pencil } from "lucide-react";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { ScholarFormValues } from "./AddScholar";

export default function CreateGeneralInformation({
  form,
}: {
  form: UseFormReturn<ScholarFormValues>;
}) {
  const [files, setFiles] = useState<File[] | null>(null);

  const { data: universities } = useGetAllUniversitiesQuery();
  const { data: provinces } = useGetAllProvincesQuery();
  const { data: currentAddresses } = useGetCurrentAddressesQuery();

  return (
    <Form {...form}>
      <div className="space-y-8 max-w-3xl mx-auto h-fit">
        <FormField
          control={form.control}
          name="avatar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avatar</FormLabel>
              <FormControl>
                <div className="flex justify-center items-center p-5 border rounded-lg">
                  <div className="relative inline-block">
                    <Avatar className="h-48 w-48">
                      <AvatarImage
                        className="rounded-full object-cover"
                        src={
                          files && files[0]
                            ? URL.createObjectURL(files[0])
                            : field.value
                            ? URL.createObjectURL(field.value)
                            : "/placeholder.svg"
                        }
                        alt="Avatar Preview"
                      />
                      <AvatarFallback className="rounded-full text-3xl">
                        {!files && !field.value
                          ? form.watch("englishName")
                            ? form
                                .watch("englishName")
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                            : "AV"
                          : ""}
                      </AvatarFallback>
                    </Avatar>

                    <label
                      htmlFor="fileInput"
                      className="absolute bottom-2 left-2 h-10 w-10 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors shadow-lg border-2 border-background"
                    >
                      <Pencil className="h-4 w-4 text-primary-foreground" />
                    </label>

                    <input
                      id="fileInput"
                      type="file"
                      accept="image/svg+xml,image/png,image/jpeg,image/gif"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFiles([file]);
                          field.onChange(file);
                        }
                      }}
                    />
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-12 gap-4 h-full">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="englishName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>English Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Kung Sovannda" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-6">
            <FormField
              control={form.control}
              name="khmerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Khmer Name</FormLabel>
                  <FormControl>
                    <Input placeholder="គង់ សុវណ្ណដា" type="text" {...field} />
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
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-6">
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
                            "pl-3 text-left font-normal",
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
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel>Phone number</FormLabel>
                  <FormControl className="w-full">
                    <PhoneInput
                      placeholder="Placeholder"
                      {...field}
                      defaultCountry="KH"
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
              name="phoneFamilyNumber"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel>Family Phone Number</FormLabel>
                  <FormControl className="w-full">
                    <PhoneInput
                      placeholder="Placeholder"
                      {...field}
                      defaultCountry="KH"
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
          name="university"
          render={({ field }) => (
            <FormItem>
              <FormLabel>University</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select current address" />
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
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isPublic"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  defaultChecked
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
      </div>
    </Form>
  );
}
