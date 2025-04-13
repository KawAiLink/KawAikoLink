import { FemboyRole, SexualOrientation } from "./enums";

export interface UserModel {
  id: number;
  email: string;
  mobileNumber: string;
  username: string;
  bio?: string | null;
  dateOfBirth: Date;
  avatarUrl?: string | null;
  hobbies: string[];
  country: string;
  secretKey: string;
  password: string;
  salt: string;
  createdAt: Date;
  preferences?: PreferencesModel | null;
  dateEnabled: boolean;
}

export interface PreferencesModel {
  id: number;
  userId: number;
  femboy: FemboyRole;
  sexualOrientation?: SexualOrientation | null;
  createdAt: Date;
  updatedAt: Date;
}