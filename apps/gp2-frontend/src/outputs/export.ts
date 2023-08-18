import { caseInsensitive, CSVValue } from '@asap-hub/frontend-utils';
import { FetchOptions, gp2 } from '@asap-hub/model';
import { formatDate } from '@asap-hub/react-components';
import { isInternalUser } from '@asap-hub/validation';
/* eslint-disable-next-line import/no-unresolved */
import { Stringifier } from 'csv-stringify/browser/esm';

export const outputFields = {
  title: 'Title',
  documentType: 'Document Type',
  type: 'Type',
  subtype: 'Subtype',
  link: 'Link',
  authors: 'Authors',
  tags: 'Tags',
  workingGroup: 'Working Group',
  project: 'Project',
  date: 'Date Added',
};

type OutputCSV = Record<keyof typeof outputFields, CSVValue>;

export const MAX_RESULTS = 10;

const sorted = (items?: string[]) => items?.sort(caseInsensitive).join(',\n');
export const outputToCSV = ({
  title,
  documentType,
  type,
  subtype,
  link,
  authors,
  workingGroup,
  project,
  addedDate,
  tags,
}: gp2.OutputResponse): OutputCSV => ({
  title,
  documentType,
  type,
  subtype,
  link,
  authors: sorted(
    authors.map((author) =>
      isInternalUser(author)
        ? author.displayName
        : `${author.displayName} (external)`,
    ),
  ),
  tags: sorted(tags?.map(({ name }) => name)) || '',
  workingGroup: workingGroup?.title,
  project: project?.title,
  date: formatDate(new Date(addedDate)),
});

export const outputsResponseToStream = async (
  csvStream: Stringifier,
  getResults: ({
    take,
    skip,
  }: FetchOptions) => Readonly<Promise<gp2.ListOutputResponse>>,
  transform: (result: gp2.OutputResponse) => Record<string, unknown>,
) => {
  let morePages = true;
  let currentPage = 0;
  while (morePages) {
    // We are doing this in chunks and streams to avoid blob/ram limits.
    // eslint-disable-next-line no-await-in-loop
    const data = await getResults({
      skip: currentPage * MAX_RESULTS,
      take: MAX_RESULTS,
    });
    data.items.map(transform).forEach((row) => csvStream.write(row));
    currentPage += 1;
    morePages = currentPage * MAX_RESULTS < data.total;
  }
  csvStream.end();
};
