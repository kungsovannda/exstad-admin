// import { AuditType } from "@/types/opening-program"; // or wherever your types are

export interface HasAudit {
  audit: {
    createdAt: string;
    updatedAt?: string | null;
  };
}

export function sortByAudit<T extends HasAudit>(data: T[]): T[] {
  return [...data].sort((a, b) => {
    const aDate = new Date(a.audit.updatedAt || a.audit.createdAt).getTime();
    const bDate = new Date(b.audit.updatedAt || b.audit.createdAt).getTime();
    return bDate - aDate; // newest first
  });
}
