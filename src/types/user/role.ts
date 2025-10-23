export enum Role {
  ADMIN = "ADMIN",
  INSTRUCTOR1 = "INSTRUCTOR1",
  INSTRUCTOR2 = "INSTRUCTOR2",
  SCHOLAR = "SCHOLAR",
}

export const toRole = (value: string): Role => {
  switch (value.toLowerCase()) {
    case "admin":
      return Role.ADMIN;
    case "instructor1":
      return Role.INSTRUCTOR1;
    case "instructor2":
      return Role.INSTRUCTOR2;
    default:
      return Role.SCHOLAR;
  }
};
