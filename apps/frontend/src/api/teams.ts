import useFetch from 'use-http';
import { ListTeamResponse, TeamResponse } from '@asap-hub/model';

import { API_BASE_URL } from '../config';
import { useFetchOptions, BasicOptions, useApiGet } from './util';

export const useTeams = ({ searchQuery, filters }: BasicOptions) =>
  useApiGet<ListTeamResponse>('teams', {
    search: searchQuery,
    filter: filters,
  });

export const useTeamById = (id: string) =>
  useFetch<TeamResponse>(`${API_BASE_URL}/teams/${id}`, useFetchOptions(), [
    id,
  ]);
