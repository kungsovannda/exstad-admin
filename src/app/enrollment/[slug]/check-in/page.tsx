"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useGetEnrollmentByUuidQuery } from "@/features/enrollment/enrollmentApi";
import { dateFormatter } from "@/utils/dateFormatter";
import { Clock, LucideUser } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function CheckInPage() {
  const search = useSearchParams();
  const id = search.get("id");
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  const { data: enrollment, isLoading } = useGetEnrollmentByUuidQuery(
    id ?? "",
    {
      refetchOnFocus: true,
      refetchOnReconnect: true,
      refetchOnMountOrArgChange: true,
      pollingInterval: 1000,
    }
  );

  if (isLoading || !enrollment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  const handleCheckIn = () => {
    setIsCheckedIn(true);
    console.log("Checked in:", enrollment.uuid);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {isCheckedIn && (
          <div className="bg-green-500 text-white py-3 px-4 text-center font-medium rounded-lg mb-4">
            ✓ Successfully Checked In!
          </div>
        )}

        <div className="flex flex-col items-center justify-center space-y-3 mb-6">
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
            <h2 className="text-2xl font-semibold">{enrollment.englishName}</h2>
            <p className="text-muted-foreground">{enrollment.email}</p>
          </div>
        </div>

        <div className="w-full space-y-2 mb-6 text-sm text-muted-foreground">
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

        <Separator className="mb-4" />

        <div className="space-y-4">
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

          <Button
            onClick={handleCheckIn}
            disabled={isCheckedIn}
            className="w-full"
            size="lg"
          >
            {isCheckedIn ? "✓ Checked In Successfully" : "Confirm Check-In"}
          </Button>
        </div>
      </div>
    </div>
  );
}
