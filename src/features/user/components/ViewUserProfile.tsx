import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { User } from "@/types/user";
import { dateFormatter } from "@/utils/dateFormatter";
import { Clock, LucideUser } from "lucide-react";

export default function ViewUserProfile({
  open,
  onOpenChange,
  user,
}: {
  open: boolean;
  onOpenChange: (status: boolean) => void;
  user: User | null;
}) {
  if (!user) return;
  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="h-screen flex flex-col max-w-2xl ml-auto">
        <DrawerHeader className=" flex flex-col space-y-3 items-center justify-center pt-6">
          <Avatar className="rounded-lg border w-[150px] h-[150px]">
            <AvatarImage
              className="rounded-lg object-cover"
              src={user.avatar || "/placeholder.svg"}
              alt={`Avatar of ${user.englishName}`}
            />
            <AvatarFallback className="text-3xl">
              {user.englishName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <DrawerTitle className="text-2xl">{user.englishName}</DrawerTitle>
            <p className="text-muted-foreground">{user.email}</p>
            <Badge variant={"outline"}>{user.role}</Badge>
          </div>
        </DrawerHeader>
        <Separator />

        <div className="p-4 overflow-y-auto space-y-4 h-full">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            <div className="space-y-2 text-sm">
              <div className="w-full flex justify-between">
                <span className="text-muted-foreground">English Name:</span>
                <p className="font-medium">{user.englishName || "N/A"}</p>
              </div>
              <div className="w-full flex justify-between">
                <span className="text-muted-foreground">Khmer Name:</span>
                <p className="font-medium">{user.khmerName || "N/A"}</p>
              </div>
              <div className="w-full flex justify-between">
                <span className="text-muted-foreground">Gender:</span>
                <p className="font-medium capitalize">{user.gender || "N/A"}</p>
              </div>
              <div className="w-full flex justify-between">
                <span className="text-muted-foreground">Date of Birth:</span>
                <p className="font-medium">{user.dob || "N/A"}</p>
              </div>
              <div className="w-full flex justify-between">
                <span className="text-muted-foreground">Username:</span>
                <p className="font-medium ">{user.username || "N/A"}</p>
              </div>
              <div className="w-full flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <p className="font-medium ">{user.email || "N/A"}</p>
              </div>
              <div className="w-full flex justify-between">
                <span className="text-muted-foreground">Role:</span>
                <p className="font-medium capitalize">{user.role || "N/A"}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="w-full justify-end space-y-2 flex flex-col text-sm text-muted-foreground">
            <div className="w-full flex justify-between">
              <div className="flex items-center space-x-1">
                <LucideUser size={14} />
                <span>Created By:</span>
              </div>
              <p>{user?.audit.createdBy ?? "N/A"}</p>
            </div>
            <div className="w-full flex justify-between">
              <div className="flex items-center space-x-1">
                <Clock size={14} />
                <span>Created At:</span>
              </div>
              <p>{dateFormatter(user?.audit.createdAt)}</p>
            </div>
            <div className="w-full flex justify-between">
              <div className="flex items-center space-x-1">
                <LucideUser size={14} />
                <span>Updated By:</span>
              </div>
              <p>{user?.audit.updatedBy ?? "N/A"}</p>
            </div>
            <div className="w-full flex justify-between">
              <div className="flex items-center space-x-1">
                <Clock size={14} />
                <span>Updated At:</span>
              </div>
              <p>{dateFormatter(user?.audit.updatedAt)}</p>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
