import { ListTeamResponse, TeamResponse } from '@asap-hub/model';

import { GetListOptions, useGetList } from './get-list';
import { useGetOne } from './get-one';

export const useTeams = ({ searchQuery, filters }: GetListOptions) =>
  useGetList<ListTeamResponse>('teams', {
    searchQuery,
    filters,
  });

export const useTeamById = (id: string) =>
  useGetOne<TeamResponse>(`teams/${id}`);
