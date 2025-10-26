import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CertificateResponse } from "../certificateApi";
import { useGetOpeningProgramByUuidQuery } from "@/features/opening-program/openingProgramApi";
import { dateFormatter } from "@/utils/dateFormatter";

interface CertificateCardProps {
  certificate: CertificateResponse;
}
export default function CertificateCard({ certificate }: CertificateCardProps) {
  const { data: program } = useGetOpeningProgramByUuidQuery(
    { uuid: certificate.uuid },
    { skip: !certificate.uuid }
  );
  return (
    <div className="flex flex-col shrink-0 rounded-md w-full space-y-2 p-5 border">
      <div className="flex w-full justify-between items-start">
        <div className="flex h-fit aspect-square border rounded-md p-2  items-center gap-3">
          <Avatar className="h-12 w-12 ">
            <AvatarImage
              className="rounded-lg object-cover"
              src={certificate.certificateUrl || certificate.tempCertificateUrl}
              alt={"Certificate"}
            />
            <AvatarFallback>
              {"Certificate"
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        <Badge variant={"outline"}>
          {certificate.isVerified ? "Verify" : "Not Verify"}
        </Badge>
      </div>

      <div className="flex flex-col">
        <span className="font-semibold">{program?.title}</span>
        <span className="text-sm text-muted-foreground">
          Issue Date: {dateFormatter(certificate.audit.createdAt)}
        </span>
      </div>
    </div>
  );
}
