import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScholarCompletedCourseType } from "@/types/scholar";

interface CompletedCourseCardProps {
  completedCourse: ScholarCompletedCourseType;
}
export default function CompletedCourseCard({
  completedCourse,
}: CompletedCourseCardProps) {
  return (
    <div className="flex flex-col shrink-0 rounded-md w-full space-y-2 p-5 border">
      <div className="flex w-full justify-between items-start">
        <div className="flex h-fit aspect-square border rounded-md p-2  items-center gap-3">
          <Avatar className="h-12 w-12 ">
            <AvatarImage
              className="rounded-lg object-cover"
              src={completedCourse.posterUrl || "/placeholder.svg"}
              alt={completedCourse.title}
            />
            <AvatarFallback>
              {completedCourse.title
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        <Badge variant={"outline"}>GEN {completedCourse.generation}</Badge>
      </div>

      <div className="flex flex-col">
        <span className="font-semibold">{completedCourse.title}</span>
        <span className="text-sm text-muted-foreground">
          {completedCourse.programName}
        </span>
      </div>
    </div>
  );
}
