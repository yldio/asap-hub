import {
  selectorFamily,
  useRecoilValue,
  SerializableParam,
  atom,
} from 'recoil';
import { ListGroupResponse } from '@asap-hub/model';

import { getGroups } from './api';
import { authorizationState } from '../auth/state';
import { GetListOptions } from '../api-util';

export const refreshListGroupState = atom<number>({
  key: 'refreshListGroup',
  default: 0,
});

const listGroupState = selectorFamily<ListGroupResponse, SerializableParam>({
  key: 'listGroup',
  get: (options) => ({ get }) => {
    get(refreshListGroupState);
    const authorization = get(authorizationState);
    return getGroups(options as GetListOptions, authorization);
  },
});

export const useGroups = (options: GetListOptions) =>
  useRecoilValue(listGroupState(options as SerializableParam));
