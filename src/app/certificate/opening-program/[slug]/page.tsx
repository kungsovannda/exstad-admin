"use client";
import { Heading } from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { scholars } from "@/data/scholars";
import { ScholarTable } from "@/features/certificate/components/data-table";
import { scholarColumn } from "@/features/certificate/components/scholar-table/columns";
import { Import } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function CertificatePage() {
  const params = useParams();
  console.log(params);
  const slug = params?.slug as string | undefined;
  return (
    <div className="flex flex-col gap-4 p-6 space-y-6 h-screen">
      <div className="flex justify-between items-center gap-10">
        <Heading
          title={(slug ?? "").replace(/-/g, " ")}
          description="Certificate Details"
        />
      </div>
      <div>
        {/* <Image src={params?.slug.template[0]} alt="" /> */}
      </div>
      <div className="flex gap-4 justify-between">
        <div className="flex flex-col gap-4 w-full max-w-xl">
          <Label htmlFor="picture">Choose Template</Label>
          <div className=" relative">
            <Input id="picture" type="file" className="sr-only h-full" />
            <label
              htmlFor="picture"
              className="flex flex-col items-center gap-2 w-full cursor-pointer rounded-md border px-40 py-16 text-center hover:opacity-70 h-full"
            >
              <Import className="h-24 w-24 text-muted-foreground" />
              <span className="truncate text-sm">
                Select a file or drag and drop here
              </span>
            </label>
          </div>
        </div>
        <div className="flex flex-col flex-1 w-full gap-3">
          <h4 className="text-sm">Choose Scholars</h4>
          <ScholarTable
            columns={scholarColumn}
            totalItems={scholars.length}
            data={scholars}
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button className="">Generate</Button>
      </div>
    </div>
  );
}
