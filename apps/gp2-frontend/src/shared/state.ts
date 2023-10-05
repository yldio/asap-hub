import { gp2 } from '@asap-hub/model';
import { atom, selector, useRecoilValue } from 'recoil';
import { authorizationState } from '../auth/state';
import { getKeywords } from './api';

const keywordsSelector = selector({
  key: 'keywords',
  get: ({ get }) => {
    const authorization = get(authorizationState);
    return getKeywords(authorization);
  },
});
const keywordsState = atom<gp2.ListTagsResponse>({
  key: 'keywordsState',
  default: keywordsSelector,
});

export const useKeywords = () => useRecoilValue(keywordsState);
