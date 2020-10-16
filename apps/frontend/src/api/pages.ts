import { join } from 'path';
import { PageResponse } from '@asap-hub/model';

import { useGetOne } from './get-one';

export const usePageByPath = (path: string) =>
  useGetOne<PageResponse>(join('pages', path), { authenticated: false });
