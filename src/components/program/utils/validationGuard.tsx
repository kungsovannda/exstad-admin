import { UseFormReturn, FieldValues } from "react-hook-form";
import { toast } from "sonner";

export function validationGuard<T extends FieldValues>(
  form: UseFormReturn<T>,
  message: string = "Please fix validation errors before closing."
) {
  return (event: Event) => {
    const { isDirty, isValid } = form.formState;

    if (isDirty && !isValid) {
      event.preventDefault();
      form.trigger(); // forces showing validation messages
      toast.error(message);
    }
  };
}
