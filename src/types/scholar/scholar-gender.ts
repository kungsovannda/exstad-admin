export enum ScholarGender {
  MALE = "Male",
  FEMALE = "Female",
  OTHER = "Other",
}

export const toScholarGender = (value: string): ScholarGender => {
  switch (value.toLowerCase()) {
    case "male":
      return ScholarGender.MALE;
    case "female":
      return ScholarGender.FEMALE;
    default:
      return ScholarGender.OTHER;
  }
};
