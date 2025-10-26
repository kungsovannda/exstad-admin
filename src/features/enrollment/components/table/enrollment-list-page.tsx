import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetCurrentAddressesQuery } from "@/features/current-address/currentAddressApi";
import { Enrollment } from "@/types/enrollment";
import { useEffect, useMemo, useState } from "react";
import { useGetAllEnrollmentsByProgramQuery } from "../../enrollmentApi";
import { enrollmentColumns } from "./all-enrollment/columns";
import { EnrollmentTable } from "./all-enrollment/data-table";
import { interviewedEnrollmentColumns } from "./interviewed-enrollment/columns";
import { InterviewedEnrollmentTable } from "./interviewed-enrollment/data-table";
import { paidEnrollmentColumns } from "./paid-enrollment/columns";
import { PaidEnrollmentTable } from "./paid-enrollment/data-table";
import { passedEnrollmentColumns } from "./passed-enrollment/columns";
import { PassedEnrollmentTable } from "./passed-enrollment/data-table";

export default function EnrollmentListPage({
  uuid,
  isShortCourse,
  codeNumber,
  codeTable,
}: {
  uuid: string | undefined;
  isShortCourse: boolean;
  codeNumber?: string;
  codeTable?: string;
}) {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [paidEnrollments, setPaidEnrollments] = useState<Enrollment[]>([]);
  const [interviewedEnrollments, setInterviewedEnrollments] = useState<
    Enrollment[]
  >([]);
  const [passedEnrollments, setPassedEnrollments] = useState<Enrollment[]>([]);
  const { data, isLoading } = useGetAllEnrollmentsByProgramQuery(uuid ?? "", {
    refetchOnFocus: true,
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: true,
    pollingInterval: 1000,
  });
  useEffect(() => {
    if (data) {
      setEnrollments(data);
      setPaidEnrollments(data.filter((d) => d.isPaid === true));
      setInterviewedEnrollments(data.filter((d) => d.isInterviewed === true));
      setPassedEnrollments(data.filter((d) => d.isPassed === true));
    }
  }, [data]);

  const { data: currentAddresses } = useGetCurrentAddressesQuery();
  const addressOptions = useMemo(
    () =>
      currentAddresses?.map((p) => ({
        label: p.englishName ?? "",
        value: p.englishName ?? "",
      })) ?? [],
    [currentAddresses]
  );

  const allEnrollmentColumns = useMemo(
    () => enrollmentColumns(addressOptions),
    [addressOptions]
  );

  const paidColumns = useMemo(
    () => paidEnrollmentColumns(addressOptions, isShortCourse),
    [addressOptions, isShortCourse]
  );
  const interviewColumns = useMemo(
    () => interviewedEnrollmentColumns(addressOptions),
    [addressOptions]
  );
  const passedColumns = useMemo(
    () => passedEnrollmentColumns(addressOptions),
    [addressOptions]
  );

  return (
    <Card className="flex flex-col rounded-lg shadow-sm">
      <Tabs defaultValue="all">
        <CardHeader className="items-center pb-2">
          <CardTitle>
            <TabsList>
              <TabsTrigger
                className="flex items-center justify-center space-x-1"
                value="all"
              >
                <span>All</span>
                <Badge className="rounded-sm h-full flex justify-center items-center w-fit text-[10px]">
                  {enrollments.length ?? 0}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                className="flex items-center justify-center space-x-1"
                value="paid"
              >
                <span>Paid</span>
                <Badge className="rounded-sm h-full flex justify-center items-center w-fit text-[10px]">
                  {paidEnrollments.length ?? 0}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                hidden={isShortCourse}
                className="flex items-center justify-center space-x-1"
                value="interviewed"
              >
                <span>Interviewed</span>
                <Badge className="rounded-sm h-full flex justify-center items-center w-fit text-[10px]">
                  {interviewedEnrollments.length ?? 0}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                hidden={isShortCourse}
                className="flex items-center justify-center space-x-1"
                value="passed"
              >
                <span>Passed</span>
                <Badge className="rounded-sm h-full flex justify-center items-center w-fit text-[10px]">
                  {passedEnrollments.length ?? 0}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TabsContent value="all">
            {isLoading ? (
              <DataTableSkeleton columnCount={enrollmentColumns.length} />
            ) : (
              <EnrollmentTable
                columns={allEnrollmentColumns}
                data={enrollments}
                totalItems={enrollments.length}
              />
            )}
          </TabsContent>
          <TabsContent value="paid">
            {isLoading ? (
              <DataTableSkeleton columnCount={paidEnrollmentColumns.length} />
            ) : (
              <PaidEnrollmentTable
                codeNumber={codeNumber}
                codeTable={codeTable}
                columns={paidColumns}
                data={paidEnrollments}
                totalItems={enrollments.length}
              />
            )}
          </TabsContent>
          <TabsContent hidden={isShortCourse} value="interviewed">
            {isLoading ? (
              <DataTableSkeleton
                columnCount={interviewedEnrollmentColumns.length}
              />
            ) : (
              <InterviewedEnrollmentTable
                columns={interviewColumns}
                data={interviewedEnrollments}
                totalItems={enrollments.length}
              />
            )}
          </TabsContent>
          <TabsContent hidden={isShortCourse} value="passed">
            {isLoading ? (
              <DataTableSkeleton columnCount={passedEnrollmentColumns.length} />
            ) : (
              <PassedEnrollmentTable
                columns={passedColumns}
                data={passedEnrollments}
                totalItems={enrollments.length}
              />
            )}
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
