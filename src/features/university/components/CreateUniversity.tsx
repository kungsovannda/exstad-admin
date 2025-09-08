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
import { Input } from "@/components/ui/input";
import { UniversityCreate } from "@/types/university";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCreateUniversityMutation } from "../universityApi";
const schema = z.object({
  englishName: z.string().min(2).max(100),
  khmerName: z.string().min(2).max(100),
  shortName: z.string().min(2).max(100),
});

export function CreateUniversity({
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
      shortName: "",
    },
  });

  const [createUniversity] = useCreateUniversityMutation();

  function onSubmit(values: z.infer<typeof schema>) {
    const university: UniversityCreate = {
      ...values,
    };
    toast.promise(createUniversity(university).unwrap(), {
      loading: "Creating...",
      success: () => {
        return "University created successfully!";
      },
      error: (error) => {
        return `Failed to create university: ${error.message}`;
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create university</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
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
                    <Input placeholder="Institute of Science..." {...field} />
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
                    <Input placeholder="វិទ្យាស្ថានអាយស្តាដ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shortName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short name</FormLabel>
                  <FormControl>
                    <Input placeholder="ISTAD" {...field} />
                  </FormControl>
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
