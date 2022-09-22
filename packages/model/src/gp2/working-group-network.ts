import { ListResponse } from '../common';
import { WorkingGroupDataObject } from './working-group';

export const workingGroupNetworkRole = [
  'complexDisease',
  'monogenic',
  'operational',
  'support',
] as const;

export type WorkingGroupNetworkRole = typeof workingGroupNetworkRole[number];

export type WorkingGroupNetworkDataObject = {
  role: WorkingGroupNetworkRole;
  workingGroups: WorkingGroupDataObject[];
};

export type ListWorkingGroupNetworkDataObject =
  ListResponse<WorkingGroupNetworkDataObject>;

export type WorkingGroupNetworkResponse = WorkingGroupNetworkDataObject;

export type ListWorkingGroupNetworkResponse =
  ListResponse<WorkingGroupNetworkResponse>;
