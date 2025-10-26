export enum ScholarStatus {
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
  DROPPED = "DROPPED",
  GRADUATED = "GRADUATED",
}

export const toScholarStatus = (value: string): ScholarStatus => {
  switch (value.toLowerCase()) {
    case "active":
      return ScholarStatus.ACTIVE;
    case "suspended":
      return ScholarStatus.SUSPENDED;
    case "dropped":
      return ScholarStatus.DROPPED;
    case "graduated":
      return ScholarStatus.GRADUATED;
    default:
      return ScholarStatus.ACTIVE;
  }
};
