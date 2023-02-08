import { Entity, Rest, RestPayload } from '../common';

export type RestUsersDegree =
  | 'AA'
  | 'AAS'
  | 'BA'
  | 'BSc'
  | 'MA'
  | 'MBA'
  | 'MBBS'
  | 'MD'
  | 'MD_PhD'
  | 'MPH'
  | 'MSc'
  | 'PhD'
  | 'PharmD';

export type RestUsersRegion =
  | 'Africa'
  | 'Asia'
  | 'Australia_Australiasia'
  | 'Europe'
  | 'Latin_America'
  | 'North_America'
  | 'South_America';

export type RestUsersRole =
  | 'Administrator'
  | 'Hidden'
  | 'Network_Collaborator'
  | 'Network_Investigator'
  | 'Trainee'
  | 'Working_Group_Participant';

export interface User<TAvatar = string> {
  avatar: TAvatar[];
  connections: { code: string }[];
  degree?: RestUsersDegree[];
  email: string;
  firstName: string;
  lastName: string;
  region: RestUsersRegion;
  role: RestUsersRole;
  onboarded: boolean;
  secondaryEmail?: string;
  telephoneCountryCode?: string;
  telephoneNumber?: string;
  questions: { question: string }[];
  biography: string;
  country: string;
  city?: string;
  positions: { role: string; department: string; institution: string }[];
  keywords: string[];
  fundingStreams: string;
  contributingCohorts: { id: string[]; role: string; study?: string }[];
  social: {
    googleScholar?: string;
    orcid?: string;
    researchGate?: string;
    researcherId?: string;
    blog?: string;
    twitter?: string;
    linkedIn?: string;
    github?: string;
  }[];
}

export interface RestUser extends Entity, Rest<User> {}

export interface InputUser extends Entity, RestPayload<User<string>> {}
