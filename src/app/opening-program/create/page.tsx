'use client'

import React from "react";
import OpeningProgramInformation from "@/components/program/opening-program-information";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


export default function Page() {
   const router = useRouter();
  
    const handleSubmit = () => {
      router.push("/opening-program"); 
    }; 
  return (
    <div className="p-5 flex flex-col gap-10">
      <h1 className="text-2xl font-semibold">Opening Program Management</h1>
      <div>
        <OpeningProgramInformation />
      </div>  
      <div className="flex justify-end mt-6">
         <Button type="button" onClick={handleSubmit}>  Save</Button>
      </div>
    </div>
  );
}
