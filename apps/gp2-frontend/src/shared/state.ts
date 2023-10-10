import { gp2 } from '@asap-hub/model';
import { atom, selector, useRecoilValue } from 'recoil';
import { authorizationState } from '../auth/state';
import { getTags } from './api';

const tagsSelector = selector({
  key: 'tags',
  get: ({ get }) => {
    const authorization = get(authorizationState);
    return getTags(authorization);
  },
});
const tagsState = atom<gp2.ListTagsResponse>({
  key: 'tagsState',
  default: tagsSelector,
});

export const useTags = () => useRecoilValue(tagsState);
