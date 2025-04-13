import { FemboyRole, SexualOrientation } from "../schema/enums";

export interface Token {
  id: string;
  email?: string;
  name?: string;
  username?: string;
  mobileNumber?: string | null;
  country?: string;
  dateOfBirth?: Date;
  bio?: string | null;
  avatarUrl?: string | null;
  hobbies?: string[];
  femboy?: FemboyRole | null;
  sexualOrientation?: SexualOrientation | null;
  dateEnabled?: boolean;
  preferences?: any | null;
  iat?: number;
  exp?: number;
  jti?: string;
}
