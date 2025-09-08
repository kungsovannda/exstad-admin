"use client";
import { Button } from "@/components/ui/button";
import { scholars } from "@/data/scholars";
import { certificateColumn } from "@/features/certificate/components/certificate-table/columns";
import { Heading } from "@/components/Heading";
import Link from "next/link";
import React from "react";
import { FiPlus } from "react-icons/fi";
import { CertificateTable } from "@/features/certificate/components/certificate-table/data-table";

export default function page() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center gap-10">
        <Heading
          title="Generate Certificate"
          description="Generate and manage certificates"
        />
        <Link href="certificate/opening-program">
          <div className="flex items-center gap-4">
            <Button variant="outline" className="flex items-center gap-2.5">
              <FiPlus className="text-[18px]" />
              <span className="text-[14px] font-bold">Generate</span>
            </Button>
            <Button className="flex items-center bg-chart-2 gap-2.5">
              Verify
            </Button>
          </div>
        </Link>
      </div>
      <CertificateTable
        columns={certificateColumn}
        totalItems={scholars.length}
        data={scholars}
      />
    </div>
  );
}
