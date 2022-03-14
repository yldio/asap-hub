import { selector, atom, useRecoilValue } from 'recoil';
import { DiscoverResponse } from '@asap-hub/model';
import { authorizationState } from '../auth/state';
import { getDiscover } from './api';

export const fetchDiscoverState = selector<DiscoverResponse>({
  key: 'fetchDiscoverState',
  get: ({ get }) => {
    get(refreshDiscoverState);
    return getDiscover(get(authorizationState));
  },
});

export const discoverState = atom<DiscoverResponse>({
  key: 'discoverState',
  default: fetchDiscoverState,
});

export const refreshDiscoverState = atom<number>({
  key: 'refreshDiscoverState',
  default: 0,
});

export const useDiscoverState = () => useRecoilValue(discoverState);
