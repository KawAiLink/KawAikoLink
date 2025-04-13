import { FemboyRole, SexualOrientation } from "../schema/enums";

export interface User {
  id: string; // String for NextAuth compatibility
  email: string;
  mobileNumber?: string | null;
  username: string;
  bio?: string | null;
  dateOfBirth?: Date;
  age?: number | null; // Calculated field
  avatarUrl?: string | null;
  hobbies?: string[];
  country?: string;
  femboy?: FemboyRole | null;
  sexualOrientation?: SexualOrientation | null;
  dateEnabled?: boolean;
  preferences?: any | null;
  name?: string; // For NextAuth compatibility
  image?: string | null; // For NextAuth compatibility
}
