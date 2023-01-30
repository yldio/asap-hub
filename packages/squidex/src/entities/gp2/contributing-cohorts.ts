import { Entity, Rest, RestPayload } from '../common';

export interface ContributingCohorts {
  name: string;
}

export interface RestContributingCohorts
  extends Entity,
    Rest<ContributingCohorts> {}

export interface InputContributingCohorts
  extends Entity,
    RestPayload<ContributingCohorts> {}
