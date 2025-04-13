import { User } from "./user";

export interface CustomSession {
  user: User;
  expires: string;
  redirect?: string;
}