import { ListTeamResponse, TeamResponse } from '@asap-hub/model';

import { useGetList } from './get-list';
import { GetListOptions } from '../api-util';
import { useGetOne } from './get-one';

export const useTeams = (options: GetListOptions) =>
  useGetList<ListTeamResponse>('teams', options);

export const useTeamById = (id: string) =>
  useGetOne<TeamResponse>(`teams/${id}`);
