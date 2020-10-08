import useFetch from 'use-http';
import { ListTeamResponse, TeamResponse } from '@asap-hub/model';

import { API_BASE_URL } from '../config';
import { useFetchOptions, BasicOptions, createApiListUrl } from './util';

export const useTeams = ({ searchQuery, filters }: BasicOptions) =>
  useFetch<ListTeamResponse>(
    createApiListUrl('/teams', { searchQuery, filters }).toString(),
    useFetchOptions(),
    [],
  );

export const useTeamById = (id: string) =>
  useFetch<TeamResponse>(`${API_BASE_URL}/teams/${id}`, useFetchOptions(), [
    id,
  ]);
