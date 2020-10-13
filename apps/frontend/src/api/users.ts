import useFetch from 'use-http';
import { UserResponse, ListUserResponse } from '@asap-hub/model';

import { API_BASE_URL } from '../config';
import { useFetchOptions, useGetList, GetListOptions } from './util';

export const useUsers = ({ searchQuery, filters }: GetListOptions) =>
  useGetList<ListUserResponse>('users', {
    searchQuery,
    filters,
  });

export const useUserById = (id: string) =>
  useFetch<UserResponse>(`${API_BASE_URL}/users/${id}`, useFetchOptions(), [
    id,
  ]);
