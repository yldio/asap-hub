import useFetch from 'use-http';
import { UserResponse } from '@asap-hub/model';

import { API_BASE_URL } from '../config';
import { useFetchOptions } from './util';

export const useUsers = () =>
  useFetch(`${API_BASE_URL}/users`, useFetchOptions(), []);

export const useUserById = (id: string) =>
  useFetch<UserResponse>(`${API_BASE_URL}/users/${id}`, useFetchOptions(), [
    id,
  ]);
