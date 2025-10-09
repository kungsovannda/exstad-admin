"use client";

import { Button } from "@/components/ui/button";
import { Scholar } from "@/types/scholar";

interface ScholarClassActionsCellProps {
  data: Scholar;
}

export default function ScholarClassActionsCell({data
}: ScholarClassActionsCellProps) {
  

  return (
    <>
      <Button variant={"outline"}>Add</Button>
    </>
  );
}
