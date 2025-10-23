"use client";
import { Button } from "@/components/ui/button";
import { User } from "@/types/user";
import { CircleUser } from "lucide-react";
import { useState } from "react";
import ViewUserProfile from "../ViewUserProfile";

export default function UserCellAction({ data }: { data: User }) {
  const [isViewProfileOpen, setIsViewProfileOpen] = useState(false);
  return (
    <Button
      onClick={() => setIsViewProfileOpen(true)}
      variant={"ghost"}
      className="h-8 w-8 p-0"
    >
      <CircleUser className="h-4 w-4" />
      {isViewProfileOpen && (
        <ViewUserProfile
          onOpenChange={setIsViewProfileOpen}
          open={isViewProfileOpen}
          user={data}
        />
      )}
    </Button>
  );
}
