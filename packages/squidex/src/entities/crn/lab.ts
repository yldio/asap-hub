import { Rest, Entity, Graphql } from '../common';

export interface Lab {
  name: string;
}

export interface RestLab extends Entity, Rest<Lab> {}
export interface GraphqlLab extends Entity, Graphql<Lab> {}
