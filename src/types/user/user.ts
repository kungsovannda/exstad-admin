import { Audit } from "..";
import { Gender } from "../scholar";
import { Role } from "./role";

export type User = {
  uuid: string;
  avatar?:string; /// just
  username: string;
  englishName: string;
  khmerName: string;
  email: string;
  gender: Gender;
  dob: string;
  role: Role;
  audit: Audit;
};

export type CreateUser = {
  username: string;
  englishName: string;
  khmerName: string;
  email: string;
  gender: Gender;
  password: string;
  cfPassword: string;
  dob: string;
  role: Role;
};
