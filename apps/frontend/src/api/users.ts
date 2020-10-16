import { UserResponse, ListUserResponse } from '@asap-hub/model';

import { GetListOptions, useGetList } from './get-list';
import { useGetOne } from './get-one';

export const useUsers = ({ searchQuery, filters }: GetListOptions) =>
  useGetList<ListUserResponse>('users', {
    searchQuery,
    filters,
  });

export const useUserById = (id: string) =>
  useGetOne<UserResponse>(`users/${id}`);
