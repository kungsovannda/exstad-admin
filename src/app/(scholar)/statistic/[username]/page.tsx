"use client";
import { Heading } from "@/components/Heading";
import { AssignBadgeScholar } from "@/components/scholar/AssignBadgeScholar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { scholars } from "@/data/scholars";
import { UpdateScholar } from "@/types/scholar";
import { Package } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function ScholarDetails() {
  const param = useParams();
  const scholar = scholars.find((s) => s.username === param.username);
  const [updateScholar, setUpdateScholar] = useState<UpdateScholar | null>(
    null
  );
  const [isAssignBadgeModalOpen, setIsAssignBadgeModalOpen] = useState(false);
  return (
    <div className="p-6 flex flex-col space-y-4">
      <Heading
        title="Scholar Profile"
        description="Note: Anything changes will affect the scholar's profile."
      />
      <Separator />

      <main className="grid grid-cols-[0.7fr_0.3fr] gap-4">
        {/* Left Content */}
        <div className="space-y-5">
          <div className="flex w-full space-x-2.5">
            <div className="w-full flex flex-col space-y-2">
              <Label>Khmer Name</Label>
              <Input
                readOnly
                className="text-muted-foreground"
                value={scholar?.khmerName}
              />
            </div>
            <div className="w-full flex flex-col space-y-2">
              <Label>English Name</Label>
              <Input
                readOnly
                className="text-muted-foreground"
                value={scholar?.englishName}
              />
            </div>
          </div>
          <div className="w-full flex flex-col space-y-2">
            <Label>Username</Label>
            <Input
              readOnly
              className="text-muted-foreground"
              value={scholar?.username}
            />
          </div>
          <div className="w-full flex flex-col space-y-2">
            <Label>Email</Label>
            <Input
              readOnly
              className="text-muted-foreground"
              value={scholar?.email}
            />
          </div>
          <div className="w-full flex flex-col space-y-2">
            <Label>Bio</Label>
            <Input
              onChange={(e) =>
                setUpdateScholar({ ...updateScholar, bio: e.target.value })
              }
              value={scholar?.bio}
            />
          </div>
          <div className="w-full flex flex-col space-y-2">
            <Label>Quote</Label>
            <Input
              onChange={(e) =>
                setUpdateScholar({ ...updateScholar, quote: e.target.value })
              }
              value={scholar?.quote}
            />
          </div>
          <div className="w-full flex flex-col space-y-2">
            <Label>University</Label>
            <Input
              onChange={(e) =>
                setUpdateScholar({
                  ...updateScholar,
                  university: e.target.value,
                })
              }
              value={scholar?.university}
            />
          </div>
          <div className="w-full flex flex-col space-y-2">
            <Label>Current Address</Label>
            <Input
              onChange={(e) =>
                setUpdateScholar({
                  ...updateScholar,
                  currentAddress: e.target.value,
                })
              }
              defaultValue={scholar?.currentAddress}
            />
          </div>
          <div className="w-full flex flex-col space-y-2">
            <Label>Province</Label>
            <Input
              onChange={(e) =>
                setUpdateScholar({ ...updateScholar, province: e.target.value })
              }
              value={scholar?.province}
            />
          </div>
          <div className="w-full flex flex-col space-y-2">
            <Label>Badges</Label>
            <div className="flex gap-2">
              {scholar?.badges.length ? (
                <div className="flex flex-wrap gap-2">
                  {scholar.badges.map((badge) => (
                    <Badge key={badge.uuid} variant="default">
                      {badge.badge.title}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No badges earned</p>
              )}
              <Button
                onClick={() => setIsAssignBadgeModalOpen(true)}
                size={"sm"}
                variant="outline"
              >
                Add Badge
              </Button>
            </div>
          </div>
        </div>

        <div className="h-full border-1 rounded-sm flex flex-col space-y-3 justify-center items-center">
          <Package size={64} className="text-muted-foreground opacity-30" />
          <span className="text-muted-foreground text-sm">
            No Achievement Found
          </span>
          <Button size={"sm"} variant="outline">
            Add Achievement
          </Button>
        </div>
      </main>
      {isAssignBadgeModalOpen && (
        <AssignBadgeScholar
          open={isAssignBadgeModalOpen}
          onOpenChange={setIsAssignBadgeModalOpen}
          scholar={scholar!}
        />
      )}
    </div>
  );
}
