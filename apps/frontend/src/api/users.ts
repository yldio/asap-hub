import useFetch from 'use-http';
import { UserResponse, ListUserResponse } from '@asap-hub/model';

import { API_BASE_URL } from '../config';
import { useFetchOptions } from './util';
import { BasicOptions, useApiGet } from './hooks';

export const useUsers = ({ searchQuery, filters }: BasicOptions) =>
  useApiGet<ListUserResponse>('users', {
    search: searchQuery,
    filter: filters,
  });

export const useUserById = (id: string) =>
  useFetch<UserResponse>(`${API_BASE_URL}/users/${id}`, useFetchOptions(), [
    id,
  ]);
