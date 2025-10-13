import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Achievement } from "@/types/achievement";

interface AchievementCardProps {
  achievement: Achievement;
}
export default function AchievementCard({ achievement }: AchievementCardProps) {
  return (
    <div className="flex flex-col shrink-0 rounded-md w-full space-y-2 p-5 border">
      <div className="flex w-full justify-between items-start">
        <div className="flex h-fit aspect-square border rounded-md p-2  items-center gap-3">
          <Avatar className="h-12 w-12 ">
            <AvatarImage
              className="rounded-lg object-cover"
              src={achievement.icon || "/placeholder.svg"}
              alt={achievement.title}
            />
            <AvatarFallback>
              {achievement.title
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        <Badge variant={"outline"}>{achievement.tag}</Badge>
      </div>

      <div className="flex flex-col">
        <span className="font-semibold">{achievement.title}</span>
        <span className="text-sm text-muted-foreground">
          {achievement.program}
        </span>
      </div>
    </div>
  );
}
