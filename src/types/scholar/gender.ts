export enum Gender {
  MALE = "Male",
  FEMALE = "Female",
  OTHER = "Other",
}

export const toGender = (value: string): Gender => {
  switch (value.toLowerCase()) {
    case "male":
      return Gender.MALE;
    case "female":
      return Gender.FEMALE;
    default:
      return Gender.OTHER;
  }
};
