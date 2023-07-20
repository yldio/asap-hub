import { ListGuideResponse } from '@asap-hub/model';
import { selectorFamily, atomFamily, useRecoilValue } from 'recoil';
import { authorizationState } from '../auth/state';
import { getGuides } from './api';

export const refreshGuideCollectionState = atomFamily<number, string>({
  key: 'refreshGuideCollection',
  default: 0,
});
export const fetchGuideCollectionState = selectorFamily<
  ListGuideResponse | undefined,
  string
>({
  key: 'fetchGuideCollection',
  get:
    (title: string) =>
    ({ get }) => {
      get(refreshGuideCollectionState(title));
      const authorization = get(authorizationState);
      return getGuides(authorization, title);
    },
});

const guideCollectionState = atomFamily<ListGuideResponse | undefined, string>({
  key: 'guideCollection',
  default: fetchGuideCollectionState,
});

export const useGuidesByCollection = (
  collection: string,
): ListGuideResponse | undefined =>
  useRecoilValue(guideCollectionState(collection));
