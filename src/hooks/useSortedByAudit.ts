import { useMemo } from "react";
import { HasAudit } from "@/utils/sortByAudit";

export function useSortedByAudit<T extends HasAudit>(data: T[]): T[] {
  return useMemo(() => {
    return [...data].sort((a, b) => {
      const aDate = new Date(a.audit.updatedAt || a.audit.createdAt).getTime();
      const bDate = new Date(b.audit.updatedAt || b.audit.createdAt).getTime();
      return bDate - aDate;
    });
  }, [data]);
}
