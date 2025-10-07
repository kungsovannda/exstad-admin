import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetAllEnrollmentsQuery } from "../../enrollmentApi";
import { interviewedEnrollmentColumns } from "./interviewed-enrollment/columns";
import { InterviewedEnrollmentTable } from "./interviewed-enrollment/data-table";
import { enrollmentColumns } from "./all-enrollment/columns";
import { EnrollmentTable } from "./all-enrollment/data-table";
import { paidEnrollmentColumns } from "./paid-enrollment/columns";
import { PaidEnrollmentTable } from "./paid-enrollment/data-table";
import { passedEnrollmentColumns } from "./passed-enrollment/columns";
import { PassedEnrollmentTable } from "./passed-enrollment/data-table";
import { useEffect, useState } from "react";
import { Enrollment } from "@/types/enrollment";

export default function EnrollmentListPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const { data, isLoading } = useGetAllEnrollmentsQuery();
  useEffect(() => {
    if (data) {
      setEnrollments(data);
    }
  }, [data]);

  return (
    <Card className="flex flex-col rounded-lg shadow-sm">
      <Tabs defaultValue="all">
        <CardHeader className="items-center pb-2">
          <CardTitle>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="paid">Paid</TabsTrigger>
              <TabsTrigger value="interviewed">Interviewed</TabsTrigger>
              <TabsTrigger value="passed">Passed</TabsTrigger>
            </TabsList>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TabsContent value="all">
            <EnrollmentTable
              columns={enrollmentColumns}
              data={enrollments}
              totalItems={enrollments.length}
            />
          </TabsContent>
          <TabsContent value="paid">
            <PaidEnrollmentTable
              columns={paidEnrollmentColumns}
              data={enrollments.filter((d) => d.isPaid === true)}
              totalItems={enrollments.length}
            />
          </TabsContent>
          <TabsContent value="interviewed">
            <InterviewedEnrollmentTable
              columns={interviewedEnrollmentColumns}
              data={enrollments.filter((d) => d.isInterviewed === true)}
              totalItems={enrollments.length}
            />
          </TabsContent>
          <TabsContent value="passed">
            <PassedEnrollmentTable
              columns={passedEnrollmentColumns}
              data={enrollments.filter((d) => d.isPassed === true)}
              totalItems={enrollments.length}
            />
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
