import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDeleteScholarAchievementMutation } from "@/features/scholar-achievement/scholarAchievementApi";
import { Achievement } from "@/types/achievement";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface AchievementCardProps {
  achievement: Achievement;
  scholarUuid: string;
}
export default function AchievementCard({
  achievement,
  scholarUuid,
}: AchievementCardProps) {
  const [deleteAchievement] = useDeleteScholarAchievementMutation();
  const handleOnDelete = () => {
    toast.promise(
      deleteAchievement({
        scholarUuid: scholarUuid,
        achievementUuid: achievement.uuid,
      }).unwrap(),
      {
        loading: "Removing...",
        success: "Achievement removed successfully",
        error: "Failed to remove achievement",
      }
    );
  };
  return (
    <div className="flex flex-col shrink-0 rounded-md w-full space-y-2 p-5 border ">
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

      <div className="flex justify-between items-end">
        <div className="flex flex-col">
          <span className="font-semibold">{achievement.title}</span>
          <span className="text-sm text-muted-foreground">
            {achievement.program}
          </span>
        </div>
        <Button
          onClick={handleOnDelete}
          size={"icon"}
          variant={"ghost"}
          className="h-6 w-6 text-destructive  rounded-full "
        >
          <Trash2 size={6} />
        </Button>
      </div>
    </div>
  );
}
