import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserProfileCell({
  avatar,
  name,
  title,
}: {
  avatar: string;
  name: string;
  title: string;
}) {
  return (
    <div className="flex h-12 items-center gap-3">
      <Avatar className="h-10 w-10">
        <AvatarImage
          className="rounded-lg object-cover"
          src={avatar || "/placeholder.svg"}
          alt={name}
        />
        <AvatarFallback>
          {name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span>{name}</span>
        <span className="text-sm opacity-50">{title}</span>
      </div>
    </div>
  );
}
