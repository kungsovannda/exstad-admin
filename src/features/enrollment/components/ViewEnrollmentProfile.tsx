import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Enrollment } from "@/types/enrollment";
import { dateFormatter } from "@/utils/dateFormatter";
import { Clock, LucideUser } from "lucide-react";

export default function ViewEnrollmentProfile({
  open,
  onOpenChange,
  enrollment,
}: {
  open: boolean;
  onOpenChange: (status: boolean) => void;
  enrollment: Enrollment;
}) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="h-screen flex flex-col max-w-2xl ml-auto">
        <DrawerHeader className="h-full flex flex-col space-y-3 items-center justify-center pt-6">
          {/* <Image
            className="rounded-lg border"
            unoptimized
            width={150}
            height={150}
            src={enrollment.avatar}
            alt={`Avatar of ${enrollment.englishName}`}
          /> */}
          <Avatar className="rounded-lg border w-[150px] h-[150px]">
            <AvatarImage
              className="rounded-lg object-cover"
              src={enrollment.avatar || "/placeholder.svg"}
              alt={`Avatar of ${enrollment.englishName}`}
            />
            <AvatarFallback className="text-3xl">
              {enrollment.englishName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <DrawerTitle className="text-2xl">
              {enrollment.englishName}
            </DrawerTitle>
            <p className="text-muted-foreground">{enrollment.email}</p>
          </div>
          <Separator />

          <div className="w-full justify-end space-y-2 flex flex-col text-sm text-muted-foreground">
            <div className="w-full flex justify-between">
              <div className="flex items-center space-x-1">
                <LucideUser size={14} />
                <span>Created By:</span>
              </div>
              <p>{enrollment?.audit?.createdBy ?? "N/A"}</p>
            </div>
            <div className="w-full flex justify-between">
              <div className="flex items-center space-x-1">
                <Clock size={14} />
                <span>Created At:</span>
              </div>
              <p>{dateFormatter(enrollment?.audit?.createdAt)}</p>
            </div>
            <div className="w-full flex justify-between">
              <div className="flex items-center space-x-1">
                <LucideUser size={14} />
                <span>Updated By:</span>
              </div>
              <p>{enrollment?.audit?.updatedBy ?? "N/A"}</p>
            </div>
            <div className="w-full flex justify-between">
              <div className="flex items-center space-x-1">
                <Clock size={14} />
                <span>Updated At:</span>
              </div>
              <p>{dateFormatter(enrollment?.audit?.updatedAt)}</p>
            </div>
          </div>
        </DrawerHeader>
        <Separator />

        <div className="p-4 overflow-y-auto space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="khmerName">Khmer Name</Label>
                <Input id="khmerName" value={enrollment.khmerName} readOnly />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Input id="gender" value={enrollment.gender} readOnly />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input id="dob" value={enrollment.dob} readOnly />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" value={enrollment.phoneNumber} readOnly />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Address Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="province">Province</Label>
                <Input id="province" value={enrollment.province} readOnly />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Current Address</Label>
                <Input
                  id="address"
                  value={enrollment.currentAddress}
                  readOnly
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Education Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="university">University</Label>
                <Input id="university" value={enrollment.university} readOnly />
              </div>

              <div className="space-y-2">
                <Label htmlFor="qualification">Education Qualification</Label>
                <Input
                  id="qualification"
                  value={enrollment.educationQualification}
                  readOnly
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Program Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="program">Program</Label>
                <Input id="program" value={enrollment.program} readOnly />
              </div>
            </CardContent>
          </Card>

          {enrollment.extra && Object.keys(enrollment.extra).length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4">
                {Object.entries(enrollment.extra).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={key}>{key}</Label>
                    <Textarea
                      className="h-fit resize-none"
                      id={key}
                      value={value}
                      readOnly
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
