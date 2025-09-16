import { useCreateClassMutation } from "@/features/opening-program/components/class/classApi";
import ClassForm, { ClassFormValues } from "./class-modal";
import { success } from "zod";
import { error } from "console";
import { ClassCreate } from "@/types/opening-program";
import { toast } from "sonner";


export default function ClassCreateModal(){
    const [createClass] = useCreateClassMutation();
    
    const handleSubmit = async (values: ClassFormValues) => {
        const payload: ClassCreate = {
            className: values.className,
            shift: values.shift,
            instructor: values.instructor,
            startTime: values.startTime,
            endTime: values.endTime,
            totalSlots: values.totalSlots,
            room: values.room,
            classCode: values.classCode,
            isWeekend: values.isWeekend,
            telegram: values.telegram,
        };
    toast.promise(createClass(payload).unwrap(),{
        loading: "Creating....",
        success: "Created Successfully!",
        error: (err) => `Failed: ${err.message || err}`
    })
    };
    return <ClassForm onSubmitClass={handleSubmit} submitLabel= "Create"/>;
}