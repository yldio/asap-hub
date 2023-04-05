import { useRecoilValue, selectorFamily } from 'recoil';
import { PageResponse } from '@asap-hub/model';
import { getPageByPath } from './api';

export const pageState = selectorFamily<PageResponse | undefined, string>({
  key: 'page',
  get: (path) => () => getPageByPath(path),
});

export const usePageByPageId = (pageId: string) =>
  useRecoilValue(pageState(pageId));
