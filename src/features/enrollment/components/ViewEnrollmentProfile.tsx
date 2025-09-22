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
import Image from "next/image";

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
          <Image
            className="rounded-lg border"
            unoptimized
            width={150}
            height={150}
            src={enrollment.avatar}
            alt={`Avatar of ${enrollment.englishName}`}
          />
          <div className="text-center">
            <DrawerTitle className="text-2xl">
              {enrollment.englishName}
            </DrawerTitle>
            <p className="text-muted-foreground">{enrollment.email}</p>
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
