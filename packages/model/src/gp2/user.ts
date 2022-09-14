import { ListResponse } from '../common';
import { Connection } from '../user';

export const gp2UserRoles = [
  'Working Group Participant',
  'Network Investigator',
  'Network Collaborator',
  'Administrator',
  'Trainee',
] as const;

export type Role = typeof gp2UserRoles[number];

export const gp2UserDegrees = [
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
export type UserDegree = typeof gp2UserDegrees[number];

export type UserDataObject = {
  avatarUrl?: string;
  connections?: Connection[];
  createdDate: string;
  degrees?: UserDegree[];
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  region: string;
  role: Role;
};

export type UserUpdateDataObject = Partial<
  Omit<UserDataObject, 'id' | 'createdDate'>
>;

export type ListUserDataObject = ListResponse<UserDataObject>;

export interface UserResponse extends Omit<UserDataObject, 'connections'> {
  displayName: string;
}
export type UserUpdateRequest = UserUpdateDataObject;
