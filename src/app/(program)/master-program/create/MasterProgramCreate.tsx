import MasterProgramForm, { MasterProgramFormValues } from "./form-field";
import { useCreateMasterProgramMutation } from "@/features/master-program/masterProgramApi";
import { toast } from "sonner";

export default function MasterProgramCreate() {
  const [createMasterProgram] = useCreateMasterProgramMutation();

const handleSubmit = (values: MasterProgramFormValues) => {
  const payload = {
    ...values,
    slug: values.title.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now(),
    programType: values.programType!,   // ✅ TypeScript now knows it's defined
    programLevel: values.programLevel!,
    visibility: values.visibility!,
  };

  toast.promise(createMasterProgram(payload).unwrap(), {
    loading: "Creating...",
    success: "Created successfully!",
    error: (err) => `Failed: ${err.message || err}`,
  });
};


  return <MasterProgramForm onSubmit={handleSubmit} submitLabel="Create" />;
}
