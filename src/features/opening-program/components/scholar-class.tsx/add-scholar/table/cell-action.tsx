// "use client";

// import { Button } from "@/components/ui/button";
// import { Scholar } from "@/types/scholar";

// interface ScholarClassActionsCellProps {
//   data: Scholar;
// }

// export default function ScholarClassActionsCell({data 
// }: ScholarClassActionsCellProps) {
  

//   return (
//     <>
//       <Button size={"sm"}  variant={"outline"}>Add</Button>
//     </>
//   );
// }

"use client";

import { Button } from "@/components/ui/button";
import { Scholar } from "@/types/scholar";

interface ScholarClassActionsCellProps {
  data: Scholar;
  onAddScholar: (scholar: Scholar) => void;
  isLoading?: boolean;
  isAlreadyAdded?: boolean; 

}

export default function ScholarClassActionsCell(
  { data, onAddScholar, isLoading ,isAlreadyAdded}: ScholarClassActionsCellProps) {
  return (
    <Button
      size="sm"
      variant={isAlreadyAdded ? "secondary" : "outline"}
      disabled={isLoading || isAlreadyAdded} 
      onClick={() => onAddScholar(data)}
    >
      {isAlreadyAdded ? "Added" : isLoading ? "Adding..." : "Add"}
    </Button>
  );
}