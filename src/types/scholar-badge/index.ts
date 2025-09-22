import { Badge } from "../badge";
import { Scholar } from "../scholar";

export type ScholarBadge = {
  uuid: string;
  completionDate: string;
  badge: Badge;
  scholar: Scholar;
};

export type CreateScholarBadge = {
  scholarUuid: string;
  badgeUuid: string;
  completionDate: string;
};
