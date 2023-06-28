import { ListGuideResponse } from '@asap-hub/model';
import { selector, atom, useRecoilValue } from 'recoil';
import { authorizationState } from '../auth/state';
import { getGuides } from './api';

export const fetchGuidesState = selector<ListGuideResponse>({
  key: 'fetchGuideState',
  get: ({ get }) => {
    get(refreshGuidesState);
    return getGuides(get(authorizationState));
  },
});

export const guidesState = atom<ListGuideResponse>({
  key: 'guideState',
  default: fetchGuidesState,
});

export const refreshGuidesState = atom<number>({
  key: 'refreshGuidesState',
  default: 0,
});

export const useGuides = () => useRecoilValue(guidesState);
