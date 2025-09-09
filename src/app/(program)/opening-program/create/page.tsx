'use client'

import React from "react";
// import { useRouter } from "next/navigation";
import OpeningProgramForm from "./form-field";


export default function Page() {
  //  const router = useRouter();
  
  //   const handleSubmit = () => {
  //     router.push("/opening-program"); 
  //   }; 
  return (
    <div className="p-5 flex flex-col gap-10">
      <h1 className="text-2xl font-semibold">Opening Program Management</h1>
      <div className="w-[70%]">
        <OpeningProgramForm />
      </div>  
    </div>
  );
}
