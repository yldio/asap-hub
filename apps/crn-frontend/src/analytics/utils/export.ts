import { GetListOptions } from '@asap-hub/frontend-utils';
import { ListResponse } from '@asap-hub/model';
import { Stringifier } from 'csv-stringify/browser/esm';

export const algoliaResultsToStream = async <T>(
  csvStream: Stringifier,
  getResults: ({
    currentPage,
    pageSize,
  }: Pick<GetListOptions, 'currentPage' | 'pageSize'>) => Readonly<
    Promise<ListResponse<T> | undefined>
  >,
  transform: (result: T) => Record<string, unknown>,
) => {
  let morePages = true;
  let currentPage = 0;
  while (morePages) {
    // eslint-disable-next-line no-await-in-loop
    const data = await getResults({
      currentPage,
      pageSize: 10,
    });
    if (data) {
      const nbPages = data.total / 10;
      data.items.map(transform).forEach((row) => csvStream.write(row));
      currentPage += 1;
      morePages = currentPage <= nbPages;
    } else {
      morePages = false;
    }
  }
  csvStream.end();
};
