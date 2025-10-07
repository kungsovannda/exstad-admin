import { ColumnDef } from "@tanstack/react-table";
import { CertificateData } from "@/types/certificate";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

export const useCertificateColumns = () => {
  const router = useRouter();

  const columns: ColumnDef<CertificateData>[] = [
    {
      accessorKey: "certificateUrl",
      header: "Certificate",
      cell: ({ row }) => (
        <button
          className="relative h-16 w-24 overflow-hidden rounded-md bg-transparent border-none p-0 cursor-pointer"
          onClick={() => router.push(`/certificate/${row.original.slug}`)}
          aria-label="View Certificate"
        >
          <Image
            src={row.getValue("certificateUrl")}
            alt={"Certificate Image"}
            fill
            unoptimized
            className="rounded-lg"
          />
        </button>
      ),
    },
    {
      accessorKey: "title",
      header: "Opening Program",
      cell: ({ row }) => (
        <button
          className="cursor-pointer bg-transparent border-none p-0"
          onClick={() => router.push(`/certificate/${row.original.slug}`)}
        >
          {row.getValue("title")}
        </button>
      ),
    },
    {
      accessorKey: "generation",
      header: "Generation",
    },
  ];

  return columns;
};