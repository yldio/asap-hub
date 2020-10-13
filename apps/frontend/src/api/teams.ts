import useFetch from 'use-http';
import { ListTeamResponse, TeamResponse } from '@asap-hub/model';

import { API_BASE_URL } from '../config';
import { useFetchOptions, GetListOptions, useGetList } from './util';

export const useTeams = (options: GetListOptions) =>
  useGetList<ListTeamResponse>('teams', options);

export const useTeamById = (id: string) =>
  useFetch<TeamResponse>(`${API_BASE_URL}/teams/${id}`, useFetchOptions(), [
    id,
  ]);
