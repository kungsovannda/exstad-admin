import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { enrollments } from "@/data/enrollments";
import { acceptedEnrollmentColumns } from "./accepted-enrollment/columns";
import { AcceptedEnrollmentTable } from "./accepted-enrollment/data-table";
import { enrollmentColumns } from "./all-enrollment/columns";
import { EnrollmentTable } from "./all-enrollment/data-table";
import { paidEnrollmentColumns } from "./paid-enrollment/columns";
import { PaidEnrollmentTable } from "./paid-enrollment/data-table";
import { passedEnrollmentColumns } from "./passed-enrollment/columns";
import { PassedEnrollmentTable } from "./passed-enrollment/data-table";

export default function EnrollmentListPage() {
  return (
    <Card className="flex flex-col rounded-lg shadow-sm">
      <Tabs defaultValue="all">
        <CardHeader className="items-center pb-2">
          <CardTitle>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="paid">Paid</TabsTrigger>
              <TabsTrigger value="accepted">Accepted</TabsTrigger>
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
          <TabsContent value="accepted">
            <AcceptedEnrollmentTable
              columns={acceptedEnrollmentColumns}
              data={enrollments.filter((d) => d.isAccepted === true)}
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
