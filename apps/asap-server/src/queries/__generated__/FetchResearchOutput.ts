/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: FetchResearchOutput
// ====================================================

export interface FetchResearchOutput_findResearchOutputsContent_flatData_authors_Users_flatData_avatar {
  __typename: "Asset";
  /**
   * The id of the asset.
   */
  id: string;
}

export interface FetchResearchOutput_findResearchOutputsContent_flatData_authors_Users_flatData_orcidWorks {
  __typename: "UsersDataOrcidWorksChildDto";
  doi: string | null;
  id: string | null;
  lastModifiedDate: string | null;
  publicationDate: JsonScalar | null;
  title: string | null;
  type: string | null;
}

export interface FetchResearchOutput_findResearchOutputsContent_flatData_authors_Users_flatData_questions {
  __typename: "UsersDataQuestionsChildDto";
  question: string | null;
}

export interface FetchResearchOutput_findResearchOutputsContent_flatData_authors_Users_flatData_teams_id_flatData_proposal {
  __typename: "ResearchOutputs";
  /**
   * The id of the content.
   */
  id: string;
}

export interface FetchResearchOutput_findResearchOutputsContent_flatData_authors_Users_flatData_teams_id_flatData {
  __typename: "TeamsFlatDataDto";
  displayName: string | null;
  proposal: FetchResearchOutput_findResearchOutputsContent_flatData_authors_Users_flatData_teams_id_flatData_proposal[] | null;
}

export interface FetchResearchOutput_findResearchOutputsContent_flatData_authors_Users_flatData_teams_id {
  __typename: "Teams";
  /**
   * The id of the content.
   */
  id: string;
  /**
   * The flat data of the content.
   */
  flatData: FetchResearchOutput_findResearchOutputsContent_flatData_authors_Users_flatData_teams_id_flatData;
}

export interface FetchResearchOutput_findResearchOutputsContent_flatData_authors_Users_flatData_teams {
  __typename: "UsersDataTeamsChildDto";
  /**
   * Attention: Check if this user needs to be added to Smart Simple
   */
  role: string | null;
  approach: string | null;
  responsibilities: string | null;
  id: FetchResearchOutput_findResearchOutputsContent_flatData_authors_Users_flatData_teams_id[] | null;
}

export interface FetchResearchOutput_findResearchOutputsContent_flatData_authors_Users_flatData_social {
  __typename: "UsersDataSocialChildDto";
  github: string | null;
  googleScholar: string | null;
  linkedIn: string | null;
  researcherId: string | null;
  researchGate: string | null;
  twitter: string | null;
  website1: string | null;
  website2: string | null;
}

export interface FetchResearchOutput_findResearchOutputsContent_flatData_authors_Users_flatData_labs_flatData {
  __typename: "LabsFlatDataDto";
  name: string | null;
}

export interface FetchResearchOutput_findResearchOutputsContent_flatData_authors_Users_flatData_labs {
  __typename: "Labs";
  /**
   * The id of the content.
   */
  id: string;
  /**
   * The flat data of the content.
   */
  flatData: FetchResearchOutput_findResearchOutputsContent_flatData_authors_Users_flatData_labs_flatData;
}

export interface FetchResearchOutput_findResearchOutputsContent_flatData_authors_Users_flatData {
  __typename: "UsersFlatDataDto";
  avatar: FetchResearchOutput_findResearchOutputsContent_flatData_authors_Users_flatData_avatar[] | null;
  biography: string | null;
  degree: string | null;
  email: string | null;
  contactEmail: string | null;
  firstName: string | null;
  institution: string | null;
  jobTitle: string | null;
  lastModifiedDate: string | null;
  lastName: string | null;
  country: string | null;
  city: string | null;
  /**
   * Use this to allow the user to see the full Hub and skip profile completion
   */
  onboarded: boolean | null;
  orcid: string | null;
  orcidLastModifiedDate: string | null;
  orcidLastSyncDate: string | null;
  orcidWorks: FetchResearchOutput_findResearchOutputsContent_flatData_authors_Users_flatData_orcidWorks[] | null;
  questions: FetchResearchOutput_findResearchOutputsContent_flatData_authors_Users_flatData_questions[] | null;
  skills: string[] | null;
  skillsDescription: string | null;
  /**
   * Mandatory for grantees. They cannot publish profile without a team.
   */
  teams: FetchResearchOutput_findResearchOutputsContent_flatData_authors_Users_flatData_teams[] | null;
  social: FetchResearchOutput_findResearchOutputsContent_flatData_authors_Users_flatData_social[] | null;
  /**
   * Role on the ASAP Hub
   */
  role: string | null;
  /**
   * Responsibilities on the ASAP Hub (only relevant for "Staff" users)
   */
  responsibilities: string | null;
  /**
   * Reach out reasons (only relevant for "Staff" users)
   */
  reachOut: string | null;
  /**
   * Mandatory for grantees. They cannot publish profile without a lab.
   */
  labs: FetchResearchOutput_findResearchOutputsContent_flatData_authors_Users_flatData_labs[] | null;
}

export interface FetchResearchOutput_findResearchOutputsContent_flatData_authors_Users {
  __typename: "Users";
  /**
   * The id of the content.
   */
  id: string;
  /**
   * The date and time when the content has been created.
   */
  created: Instant;
  /**
   * The date and time when the content has been modified last.
   */
  lastModified: Instant;
  /**
   * The flat data of the content.
   */
  flatData: FetchResearchOutput_findResearchOutputsContent_flatData_authors_Users_flatData;
}

export interface FetchResearchOutput_findResearchOutputsContent_flatData_authors_ExternalAuthors_flatData {
  __typename: "ExternalAuthorsFlatDataDto";
  name: string | null;
  orcid: string | null;
}

export interface FetchResearchOutput_findResearchOutputsContent_flatData_authors_ExternalAuthors {
  __typename: "ExternalAuthors";
  /**
   * The id of the content.
   */
  id: string;
  /**
   * The date and time when the content has been created.
   */
  created: Instant;
  /**
   * The date and time when the content has been modified last.
   */
  lastModified: Instant;
  /**
   * The flat data of the content.
   */
  flatData: FetchResearchOutput_findResearchOutputsContent_flatData_authors_ExternalAuthors_flatData;
}

export type FetchResearchOutput_findResearchOutputsContent_flatData_authors = FetchResearchOutput_findResearchOutputsContent_flatData_authors_Users | FetchResearchOutput_findResearchOutputsContent_flatData_authors_ExternalAuthors;

export interface FetchResearchOutput_findResearchOutputsContent_flatData {
  __typename: "ResearchOutputsFlatDataDto";
  title: string | null;
  type: string | null;
  subtype: string | null;
  /**
   * The Hub will only show text or hyperlinks. Other formatting will be ignored (e.g. bold, color, size)
   */
  description: string | null;
  link: string | null;
  /**
   * Date output was shared with ASAP Network (different from publication date)
   */
  addedDate: Instant | null;
  /**
   * Date of publishing (outside the Hub). Only applies to outputs that have been published.
   */
  publishDate: Instant | null;
  /**
   * DOIs must start with a number and cannot be a URL
   */
  doi: string | null;
  /**
   * If this is a hyperlink, please start with "http: // " or "https:
   */
  labCatalogNumber: string | null;
  /**
   * This must start with a letter
   */
  accession: string | null;
  /**
   * This must start with "RRID:"
   */
  rrid: string | null;
  tags: string[] | null;
  /**
   * Does not include changes to Publish Date and Admin notes
   */
  lastUpdatedPartial: Instant | null;
  /**
   * The Hub will only show text or hyperlinks. Other formatting will be ignored (e.g. bold, color, size)
   */
  accessInstructions: string | null;
  sharingStatus: string | null;
  /**
   * "Not sure" will not be shown on the Hub
   */
  asapFunded: string | null;
  /**
   * "Not sure" will not be shown on the Hub
   */
  usedInAPublication: string | null;
  authors: FetchResearchOutput_findResearchOutputsContent_flatData_authors[] | null;
}

export interface FetchResearchOutput_findResearchOutputsContent_referencingTeamsContents_flatData {
  __typename: "TeamsFlatDataDto";
  displayName: string | null;
}

export interface FetchResearchOutput_findResearchOutputsContent_referencingTeamsContents_referencingUsersContents_flatData_teams_id {
  __typename: "Teams";
  /**
   * The id of the content.
   */
  id: string;
}

export interface FetchResearchOutput_findResearchOutputsContent_referencingTeamsContents_referencingUsersContents_flatData_teams {
  __typename: "UsersDataTeamsChildDto";
  /**
   * Attention: Check if this user needs to be added to Smart Simple
   */
  role: string | null;
  id: FetchResearchOutput_findResearchOutputsContent_referencingTeamsContents_referencingUsersContents_flatData_teams_id[] | null;
}

export interface FetchResearchOutput_findResearchOutputsContent_referencingTeamsContents_referencingUsersContents_flatData {
  __typename: "UsersFlatDataDto";
  email: string | null;
  /**
   * Mandatory for grantees. They cannot publish profile without a team.
   */
  teams: FetchResearchOutput_findResearchOutputsContent_referencingTeamsContents_referencingUsersContents_flatData_teams[] | null;
}

export interface FetchResearchOutput_findResearchOutputsContent_referencingTeamsContents_referencingUsersContents {
  __typename: "Users";
  /**
   * The flat data of the content.
   */
  flatData: FetchResearchOutput_findResearchOutputsContent_referencingTeamsContents_referencingUsersContents_flatData;
}

export interface FetchResearchOutput_findResearchOutputsContent_referencingTeamsContents {
  __typename: "Teams";
  /**
   * The id of the content.
   */
  id: string;
  /**
   * The date and time when the content has been created.
   */
  created: Instant;
  /**
   * The date and time when the content has been modified last.
   */
  lastModified: Instant;
  /**
   * The flat data of the content.
   */
  flatData: FetchResearchOutput_findResearchOutputsContent_referencingTeamsContents_flatData;
  /**
   * Query Users content items.
   */
  referencingUsersContents: FetchResearchOutput_findResearchOutputsContent_referencingTeamsContents_referencingUsersContents[] | null;
}

export interface FetchResearchOutput_findResearchOutputsContent {
  __typename: "ResearchOutputs";
  /**
   * The id of the content.
   */
  id: string;
  /**
   * The date and time when the content has been created.
   */
  created: Instant;
  /**
   * The date and time when the content has been modified last.
   */
  lastModified: Instant;
  /**
   * The flat data of the content.
   */
  flatData: FetchResearchOutput_findResearchOutputsContent_flatData;
  /**
   * Query Teams content items.
   */
  referencingTeamsContents: FetchResearchOutput_findResearchOutputsContent_referencingTeamsContents[] | null;
}

export interface FetchResearchOutput {
  /**
   * Find an Research Outputs content by id.
   */
  findResearchOutputsContent: FetchResearchOutput_findResearchOutputsContent | null;
}

export interface FetchResearchOutputVariables {
  id: string;
  withTeams: boolean;
}
