import { gp2 } from '@asap-hub/model';
import { Entity, Rest, RestPayload } from '../common';

export type RestProjectsMembersRole =
  | 'Contributor'
  | 'Investigator'
  | 'Project_CoLead'
  | 'Project_Lead'
  | 'Project_Manager';

export interface Project {
  resources?: gp2.Resource[];
  members?: {
    user: string[];
    role: RestProjectsMembersRole;
  }[];
}

export interface RestProject extends Entity, Rest<Project> {}

export interface InputProject extends Entity, RestPayload<Project> {}
