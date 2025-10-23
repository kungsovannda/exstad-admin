import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllProvincesQuery } from "@/features/province/provinceApi";
import { CreateCurrentAddress } from "@/types/current-address";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useCreateCurrentAddressMutation } from "../currentAddressApi";
const schema = z.object({
  englishName: z.string().min(2).max(100),
  khmerName: z.string().min(2).max(100),
  province: z.string().min(2).max(100),
});

export function CreateCurrentAddressModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      englishName: "",
      khmerName: "",
      province: "",
    },
  });

  const [createCurrentAddress] = useCreateCurrentAddressMutation();
  const { data: provinces } = useGetAllProvincesQuery();

  function onSubmit(values: z.infer<typeof schema>) {
    const payload: CreateCurrentAddress = {
      ...values,
    };
    toast.promise(createCurrentAddress(payload).unwrap(), {
      loading: "Creating...",
      success: () => {
        return "Current Address created successfully!";
      },
      error: (error) => {
        return `Failed to create current address: ${error.message}`;
      },
    });
    onOpenChange(false);
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
        className="sm:max-w-[425px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Create current address</DialogTitle>
          <DialogDescription>
            Input the following information for creating the current address
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="create-university-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="englishName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>English name</FormLabel>
                  <FormControl>
                    <Input placeholder="Bakan" {...field} />
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
                  <FormLabel>Khmer name</FormLabel>
                  <FormControl>
                    <Input placeholder="បាកាន" {...field} />
                  </FormControl>
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
                  <Select onValueChange={field.onChange} value={field.value}>
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
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button form="create-university-form" type="submit">
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
