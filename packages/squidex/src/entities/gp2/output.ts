import { gp2 } from '@asap-hub/model';
import {
  Entity,
  Graphql,
  GraphqlWithTypename,
  Rest,
  RestPayload,
} from '../common';
import { GraphqlExternalAuthor } from '../crn';
import { GraphqlUserAssoc } from './user';

export interface Output<TAuthorConnection = string, TUserConnection = string> {
  addedDate: string;
  adminNotes?: string;
  authors?: TAuthorConnection[];
  createdBy?: TUserConnection[];
  documentType: gp2.OutputDocumentType;
  lastUpdatedPartial?: string;
  link?: string;
  subtype?: gp2.OutputSubType;
  title: string;
  type?: gp2.OutputType;
  updatedBy?: TUserConnection[];
}

export interface RestOutput extends Entity, Rest<Output> {}
export interface InputOutput
  extends Entity,
    RestPayload<Omit<Output, 'contactEmails' | 'adminNotes'>> {}

export type GraphqlExternalAuthorAssoc = GraphqlWithTypename<
  GraphqlExternalAuthor,
  'ExternalAuthors'
>;

export type GraphqlOutputAuthors =
  | GraphqlUserAssoc
  | GraphqlExternalAuthorAssoc;
export interface GraphqlOutput
  extends Entity,
    Graphql<Output<GraphqlOutputAuthors>> {}
