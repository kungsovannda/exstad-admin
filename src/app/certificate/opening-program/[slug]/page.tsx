"use client";
import { Heading } from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { scholarsForCertificate } from "@/data/certificate";
import { openingProgramData } from "@/data/openingProgramData";
import { ScholarTable } from "@/features/certificate/components/data-table";
import { scholarColumn } from "@/features/certificate/components/scholar-table/columns";
import { openingProgramType } from "@/types/opening-program";
import { CloudUpload } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CertificatePage() {
  const openingPrograms: openingProgramType[] = openingProgramData;

  // This will use slug to fetch the specific opening program details
  const params = useParams();
  console.log(params);
  const slug = params?.slug as string | undefined;

  const program = openingPrograms.find((p) => p.slug === slug);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  useEffect(() => {
    if (program?.template && program.template.length > 0) {
      setSelectedIndex(0);
    }
  }, [program?.template]);

  return (
    <div className="flex flex-col gap-4 p-6 space-y-6 h-[90vh]">
      <div className="flex justify-between items-center gap-10">
        <Heading
          title={(slug ?? "")
            .replace(/-/g, " ")
            .replace(/\b\w/g, (ch) => ch.toUpperCase())}
          description="Certificate Details"
        />
      </div>
      <div className="flex gap-10 justify-between">
        <div className="flex flex-col gap-4 w-full max-w-xl">
          <Label htmlFor="picture">Choose Template</Label>
          <div className=" relative">
            <Input id="picture" type="file" className="sr-only h-full" />
            <label
              htmlFor="picture"
              className="flex flex-col items-center gap-2 w-full cursor-pointer rounded-md border px-40 py-16 text-center hover:opacity-70 h-full"
            >
              <CloudUpload className="h-24 w-24 text-muted-foreground" />
              <span className="truncate text-sm text-muted-foreground">
                Select a file or drag and drop here
              </span>
            </label>
          </div>
          {/* templates: main selected image + selectable thumbnails */}
          {program?.template && program.template.length > 0 ? (
            <div>
              <div className="mb-4">
                <Image
                  src={
                    program.template[selectedIndex] ?? "/images/placeholder.png"
                  }
                  alt={program.title ?? "selected template"}
                  width={300}
                  height={200}
                  className="object-cover rounded-md"
                />
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                {program.template.map((src, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedIndex(i)}
                    className={`rounded-md overflow-hidden border-2 p-0 ${
                      selectedIndex === i
                        ? "border-indigo-500"
                        : "border-transparent"
                    }`}
                    aria-label={`Select template ${i + 1}`}
                    title={`Select template ${i + 1}`}
                  >
                    <Image
                      src={src}
                      alt={`${program.title ?? "template"} ${i + 1}`}
                      width={140}
                      height={40}
                      className="object-cover w-full h-auto"
                    />
                    <span className="sr-only">
                      {selectedIndex === i ? "Selected" : "Select"} template{" "}
                      {i + 1}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
        <div className="flex flex-col flex-1 w-full gap-3">
          <h4 className="text-sm">Choose Scholars</h4>
          <ScholarTable
            columns={scholarColumn}
            totalItems={scholarsForCertificate.length}
            data={scholarsForCertificate}
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          className="bg-green-600"
          onClick={() => toast("Generated Successfully")}
        >
          Generate
        </Button>
      </div>
    </div>
  );
}
