import { ListUserResponse } from '@asap-hub/model';

import { useGetList } from './get-list';
import { GetListOptions } from '../api-util';

export const useUsers = (options: GetListOptions) =>
  useGetList<ListUserResponse>('users', options);
