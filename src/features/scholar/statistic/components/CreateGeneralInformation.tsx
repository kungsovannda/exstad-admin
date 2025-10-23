"use client";
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
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";
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
import { ScholarGeneralInformation } from "@/types/scholar";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, CloudUpload } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  englishName: z
    .string({ error: "English name is required" })
    .min(5, { message: "English name must be at least 5 characters." })
    .max(100, { message: "English name must be at most 100 characters." }),

  khmerName: z
    .string({ error: "Khmer name is required" })
    .min(5, { message: "Khmer name must be at least 5 characters." })
    .max(100, { message: "Khmer name must be at most 100 characters." }),

  gender: z.string({ error: "Please select a gender" }),

  dob: z.date({ error: "Date of birth is required" }),

  phoneNumber: z.string({ error: "Phone number is required" }),
  phoneFamilyNumber: z.string({ error: "Family phone number is required" }),
  university: z.string({ error: "Please select a university" }),
  province: z.string({ error: "Please select a province" }),
  currentAddress: z.string({ error: "Please select a current address" }),
  isPublic: z.boolean().optional(),
  avatar: z.string().optional(),
});

export default function CreateGeneralInformation({
  data,
  handleOnSubmit,
}: {
  data?: ScholarGeneralInformation;
  handleOnSubmit: (data: ScholarGeneralInformation) => void;
}) {
  const [files, setFiles] = useState<File[] | null>(null);

  const dropZoneConfig = {
    maxFiles: 5,
    maxSize: 1024 * 1024 * 4,
    multiple: false,
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: data
      ? {
          ...data,
          dob: data.dob ? new Date(data.dob) : new Date(),
        }
      : {
          dob: new Date(),
        },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { dob, ...otherValues } = values;
    const scholarInfo: ScholarGeneralInformation = {
      dob: dob.toISOString(),
      ...otherValues,
    };
    handleOnSubmit(scholarInfo);
  }

  const { data: universities } = useGetAllUniversitiesQuery();
  const { data: provinces } = useGetAllProvincesQuery();
  const { data: currentAddresses } = useGetCurrentAddressesQuery();

  return (
    <Form {...form}>
      <form
        id="scholar-general-information-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-3xl mx-auto h-fit"
      >
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
                    <Input placeholder="គង់ សុវណ្ណដា" type="" {...field} />
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

        <FormField
          control={form.control}
          name="avatar"
          render={() => (
            <FormItem>
              <FormLabel>Avatar</FormLabel>
              <FormControl>
                <FileUploader
                  value={files}
                  onValueChange={setFiles}
                  dropzoneOptions={dropZoneConfig}
                  className="relative bg-background rounded-lg p-2"
                >
                  <FileInput
                    id="fileInput"
                    className="outline-dashed outline-1 outline-slate-500"
                  >
                    <div className="flex items-center justify-center flex-col p-8 w-full ">
                      <CloudUpload className="text-gray-500 w-10 h-10" />
                      <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span>
                        &nbsp; or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        SVG, PNG, JPG or GIF
                      </p>
                    </div>
                  </FileInput>
                  <FileUploaderContent>
                    {files &&
                      files.length > 0 &&
                      files.map((file, i) => (
                        <FileUploaderItem
                          className="h-16 overflow-hidden flex items-start justify-start"
                          key={i}
                          index={i}
                        >
                          <figure className="h-16 aspect-square rounded-sm overflow-hidden object-center">
                            <Image
                              className="rounded-sm"
                              width={64}
                              height={64}
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                            />
                          </figure>
                          <span>{file.name}</span>
                        </FileUploaderItem>
                      ))}
                  </FileUploaderContent>
                </FileUploader>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
