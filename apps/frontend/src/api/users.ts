import useFetch from 'use-http';
import { UserResponse, ListUserResponse } from '@asap-hub/model';

import { API_BASE_URL } from '../config';
import { useFetchOptions, BasicOptions, createApiListUrl } from './util';

export const useUsers = ({ searchQuery, filters }: BasicOptions) =>
  useFetch<ListUserResponse>(
    createApiListUrl('/users', { searchQuery, filters }).toString(),
    useFetchOptions(),
    [searchQuery, filters],
  );

export const useUserById = (id: string) =>
  useFetch<UserResponse>(`${API_BASE_URL}/users/${id}`, useFetchOptions(), [
    id,
  ]);
