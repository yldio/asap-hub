import { UserResponse, ListUserResponse } from '@asap-hub/model';

import { GetListOptions, useGetList } from './get-list';
import { useGetOne } from './get-one';

export const useUsers = (options: GetListOptions) =>
  useGetList<ListUserResponse>('users', options);

export const useUserById = (id: string) =>
  useGetOne<UserResponse>(`users/${id}`);
