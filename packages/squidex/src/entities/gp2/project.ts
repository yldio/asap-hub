import { gp2 } from '@asap-hub/model';
import { Entity, Rest, RestPayload } from '../common';

export interface Project {
  resources: gp2.Resource[];
}

export interface RestProject extends Entity, Rest<Project> {}

export interface InputProject extends Entity, RestPayload<Project> {}
