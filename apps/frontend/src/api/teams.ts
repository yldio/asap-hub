import useFetch from 'use-http';
import { ListTeamResponse, TeamResponse } from '@asap-hub/model';

import { API_BASE_URL } from '../config';
import { useFetchOptions } from './util';

export const useTeams = () =>
  useFetch<ListTeamResponse>(`${API_BASE_URL}/teams`, useFetchOptions(), []);

export const useTeamById = (id: string) =>
  useFetch<TeamResponse>(`${API_BASE_URL}/teams/${id}`, useFetchOptions(), [
    id,
  ]);
