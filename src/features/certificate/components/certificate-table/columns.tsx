import { ColumnDef } from "@tanstack/react-table";
import { CertificateData } from "@/types/certificate";
import Image from "next/image";

export const certificateColumn: ColumnDef<CertificateData>[] = [
  {
    accessorKey: "certificateUrl",
    header: "Certificate",
    cell: ({ row }) => {
      return (
        <div className="relative h-16 w-24 overflow-hidden rounded-md">
          <Image
            src={row.getValue("certificateUrl")}
            alt={"Certificate Image"}
            fill
            unoptimized
            className="rounded-lg"
          />
        </div>
      );
    },
  },
  // {
  //   accessorKey: "englishName",
  //   header: "Scholar Name",
  //   cell: ({ row }) => {
  //     return (
  //       <div className="h-8 flex justify-start items-center">
  //         {row.getValue("englishName")}
  //       </div>
  //     );
  //   },
  // },
  // {
  //   accessorKey: "khmerName",
  //   header: "Khmer Name",
  // },
  {
    accessorKey: "title",
    header: "Opening Program",
  },
  {
    accessorKey: "generation",
    header: "Generation",
  },
];
