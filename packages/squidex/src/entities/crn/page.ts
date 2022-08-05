import { Rest, Entity, Graphql } from '../common';

export interface Page {
  path: string;
  title: string;
  shortText?: string;
  text: string;
  link?: string;
  linkText?: string;
}

export interface RestPage extends Entity, Rest<Page> {}
export interface GraphqlPage extends Entity, Graphql<Page> {}
