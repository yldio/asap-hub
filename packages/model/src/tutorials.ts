import { ListResponse } from './common';
import { EventDataObject } from './event';
import { TeamResponse } from './team';
import { sharingStatuses } from './research-output';
import { AuthorResponse } from './authors';

export type TutorialsSharingStatus = (typeof sharingStatuses)[number];
export interface TutorialsDataObject {
  id: string;
  title: string;
  shortText?: string;
  thumbnail?: string;
  link?: string;
  linkText?: string;
  text?: string;
  created: string;
  lastUpdated?: string;
  datePublished?: string;
  tags: string[];
  asapFunded?: boolean;
  usedInPublication?: boolean;
  sharingStatus?: TutorialsSharingStatus;
  authors: AuthorResponse[];
  teams: Pick<TeamResponse, 'id' | 'displayName'>[];
  relatedEvents: Array<Pick<EventDataObject, 'id' | 'title' | 'endDate'>>;
  relatedTutorials: Array<
    Pick<TutorialsDataObject, 'id' | 'title' | 'created'> & {
      isOwnRelatedTutorialLink?: boolean;
    }
  >;
}

export type ListTutorialsDataObject = ListResponse<TutorialsDataObject>;

export type TutorialsResponse = TutorialsDataObject;

export type ListTutorialsResponse = ListResponse<TutorialsResponse>;
