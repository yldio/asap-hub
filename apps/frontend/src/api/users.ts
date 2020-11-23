import { ListUserResponse } from '@asap-hub/model';

import { GetListOptions, useGetList } from './get-list';

export const useUsers = (options: GetListOptions) =>
  useGetList<ListUserResponse>('users', options);
