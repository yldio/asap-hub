import { Entity, Rest, RestPayload } from '../common';

export interface ContributingCohort {
  name: string;
}

export interface RestContributingCohort
  extends Entity,
    Rest<ContributingCohort> {}

export interface InputContributingCohort
  extends Entity,
    RestPayload<ContributingCohort> {}
