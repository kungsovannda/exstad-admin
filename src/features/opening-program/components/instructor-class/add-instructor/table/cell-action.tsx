"use client";

import { Button } from "@/components/ui/button";
import { User } from "@/types/user";

interface InstructorsClassActionsCellProps {
  data: User;
  onAddInstructors: (instructor: User) => void;
  isLoading?: boolean;
  isAlreadyAdded?: boolean; 

}

export default function InstructorClassActionsCell(
  { data, onAddInstructors, isLoading ,isAlreadyAdded}: InstructorsClassActionsCellProps) {
  return (
    <Button
      size="sm"
      variant={isAlreadyAdded ? "secondary" : "outline"}
      disabled={isLoading || isAlreadyAdded} 
      onClick={() => onAddInstructors(data)}
    >
      {isAlreadyAdded ? "Added" : isLoading ? "Adding..." : "Add"}
    </Button>
  );
}