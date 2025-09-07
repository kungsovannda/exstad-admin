import { Audit } from "..";

export type Badge = {
  uuid: string;
  badgeImage: string;
  title: string;
  description: string;
  isDeleted: boolean;
  audit: Audit;
};

export type BadgeForScholar = {
  uuid: string;
  completionDate: string;
  badge: Badge;
};

export type CreateBadge = {
  title: string;
  description: string;
  badgeImage: string;
};

export type UpdateBadge = {
  title?: string;
  description?: string;
  badgeImage?: string;
};
