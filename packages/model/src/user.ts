export interface Invitee {
  displayName: string;
  email: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  biography?: string;
  jobTitle?: string;
  orcid?: string;
  department?: string;
  institution?: string;
  location?: string;
}

export interface OrcidWork {
  id: string;
  doi?: string;
  title?: string;
  type: string;
  publicationDate: {
    year: string;
    month?: string;
    day?: string;
  };
}

export interface UserResponse extends Invitee {
  id: string;
  teams: ReadonlyArray<{
    id: string;
    displayName: string;
    role: string;
  }>;
  orcidLastModifiedDate?: string;
  orcidWorks?: OrcidWork[];
  skills: string[];
}
