import { gp2 } from '@asap-hub/model';
import { GraphqlExternalUser } from '.';
import {
  Entity,
  Graphql,
  GraphqlWithTypename,
  Rest,
  RestPayload,
} from '../common';
import { GraphqlUserAssoc } from './user';

export type RestOutputDocumentType =
  | 'Procedural_Form'
  | 'Update'
  | 'Training_Material'
  | 'Data_Release'
  | 'Article'
  | 'Code_Software';

export type RestOutputType =
  | 'Research'
  | 'Review'
  | 'Letter'
  | 'Hot_Topic'
  | 'Blog';
export interface Output<TAuthorConnection = string, TUserConnection = string> {
  addedDate: string;
  adminNotes?: string;
  authors?: TAuthorConnection[];
  createdBy?: TUserConnection[];
  documentType: RestOutputDocumentType;
  lastUpdatedPartial?: string;
  link?: string;
  subtype?: gp2.OutputSubtype;
  title: string;
  type?: RestOutputType;
  updatedBy?: TUserConnection[];
  project?: string;
  workingGroup?: string;
}

export interface RestOutput extends Entity, Rest<Output> {}
export interface InputOutput
  extends Entity,
    RestPayload<Omit<Output, 'contactEmails' | 'adminNotes'>> {}

export type GraphqlExternalUserAssoc = GraphqlWithTypename<
  GraphqlExternalUser,
  'ExternalUsers'
>;

export type GraphqlOutputAuthors = GraphqlUserAssoc | GraphqlExternalUserAssoc;
export interface GraphqlOutput
  extends Entity,
    Graphql<Output<GraphqlOutputAuthors>> {}
