export interface Invitee {
  displayName: string;
  email: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  jobTitle?: string;
  orcid?: string;
  department?: string;
  institution?: string;
  location?: string;
}

export interface UserResponse extends Invitee {
  id: string;
  teams: ReadonlyArray<{
    id: string;
    displayName: string;
    role: string;
  }>;
}
