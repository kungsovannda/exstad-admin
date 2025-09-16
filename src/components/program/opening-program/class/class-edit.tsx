import { useGetClassByUuidQuery, useUpdateClassMutation } from "@/features/opening-program/components/class/classApi";
import { useParams } from "next/navigation";
import { ClassFormValues } from "./class-modal";
import { toast } from "sonner";


export default function ClassEdit(){
    const params = useParams();
    const uuid = params?.uuid as string;
    const {data: classes, isLoading,error} = useGetClassByUuidQuery({uuid});
    const [updateClass] = useUpdateClassMutation();
    
    if (isLoading) return <div>Loading...</div>
    if(error || !classes ) return <div>Class not found</div>;

    const initialValues: ClassFormValues= {
        ...classes,
    };

    const handleSubmit = (values: ClassFormValues) => {
        const payload = {
            ...values
        };
        toast.promise(updateClass({uuid: classes.uuid,body:payload}).unwrap(), {
            loading: "Updating...",
            success: ""
        })
    }
}