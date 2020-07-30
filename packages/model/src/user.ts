export interface Invitee {
  displayName: string;
  email: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  jobTitle?: string;
  orcid?: string;
  institution?: string;
}

export interface UserResponse extends Invitee {
  id: string;
}
