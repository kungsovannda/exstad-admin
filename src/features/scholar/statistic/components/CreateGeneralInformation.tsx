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
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, CloudUpload, Paperclip } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { ScholarGeneralInformation } from "./AddScholar";
import Image from "next/image";

const formSchema = z.object({
  englishName: z.string().min(1).min(5).max(100),
  khmerName: z.string().min(1).min(5).max(100),
  gender: z.string(),
  dob: z.date(),
  phoneNumber: z.string(),
  familyPhoneNumber: z.string(),
  university: z.string(),
  province: z.string(),
  currentAddress: z.string(),
  isPublic: z.boolean().optional(),
  avatar: z.string().optional(),
});

export default function CreateGeneralInformation({
  handleOnSubmit,
}: {
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
    defaultValues: {
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
    try {
      console.log(values);
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      );
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
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
              name="familyPhoneNumber"
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
