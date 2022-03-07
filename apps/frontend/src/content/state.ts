import { useRecoilValue, selectorFamily, atomFamily } from 'recoil';
import { PageResponse } from '@asap-hub/model';
import { getPageByPath } from './api';

const fetchPageState = selectorFamily<PageResponse | undefined, string>({
  key: 'fetchPage',
  get:
    (path) =>
    async ({ get }) => {
      get(refreshPageState(path));
      return getPageByPath(path);
    },
});

export const pageState = atomFamily<PageResponse | undefined, string>({
  key: 'page',
  default: fetchPageState,
});

export const refreshPageState = atomFamily<number, string>({
  key: 'refreshPage',
  default: 0,
});

export const usePageByPath = (path: string) => useRecoilValue(pageState(path));
