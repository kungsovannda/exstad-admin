import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/services/format";
import { BadgeForScholar } from "@/types/badge";

interface BadgeCardProps {
  badge: BadgeForScholar;
}
export default function BadgeCard({ badge }: BadgeCardProps) {
  return (
    <div className="flex flex-col shrink-0 rounded-md w-full space-y-2 p-5 border">
      <div className="flex w-full justify-between items-start">
        <div className="flex h-fit aspect-square border rounded-md p-2  items-center gap-3">
          <Avatar className="h-12 w-12 ">
            <AvatarImage
              className="rounded-lg object-cover"
              src={badge.badge.badgeImage || "/placeholder.svg"}
              alt={badge.badge.title}
            />
            <AvatarFallback>
              {badge.badge.title
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        <Badge variant={"outline"}>{formatDate(badge.completionDate)}</Badge>
      </div>

      <div className="flex flex-col">
        <span className="font-semibold">{badge.badge.title}</span>
        <span className="text-sm text-muted-foreground">
          {badge.badge.description}
        </span>
      </div>
    </div>
  );
}
