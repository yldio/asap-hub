import { ListResponse } from '../common';
import { Connection } from '../user';

export const userRoles = [
  'Working Group Participant',
  'Network Investigator',
  'Network Collaborator',
  'Administrator',
  'Trainee',
] as const;

export type UserRole = typeof userRoles[number];

export const userDegrees = [
  'AA',
  'AAS',
  'BA',
  'BSc',
  'MSc',
  'PhD',
  'MD',
  'MD, PhD',
  'MPH',
  'MA',
  'MBA',
  'PharmD',
  'MBBS',
] as const;
export type UserDegree = typeof userDegrees[number];

export const userRegions = [
  'Africa',
  'Asia',
  'Australia/Australiasia',
  'Europe',
  'North America',
  'Latin America',
  'South America',
] as const;

export type UserRegion = typeof userRegions[number];

type UserPosition = {
  role: string;
  department: string;
  institution: string;
};

export type UserDataObject = {
  avatarUrl?: string;
  city?: string;
  connections?: Connection[];
  country: string;
  createdDate: string;
  degrees?: UserDegree[];
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  onboarded: boolean;
  positions: UserPosition[];
  region: UserRegion;
  role: UserRole;
};

export type UserUpdateDataObject = Partial<
  Omit<UserDataObject, 'id' | 'createdDate'>
>;

export type ListUserDataObject = ListResponse<UserDataObject>;

export interface UserResponse extends Omit<UserDataObject, 'connections'> {
  displayName: string;
}
export type ListUserResponse = ListResponse<UserResponse>;
export type UserUpdateRequest = UserUpdateDataObject;
