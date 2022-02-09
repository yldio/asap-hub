import { SearchResponse } from '@asap-hub/algolia';
import { isInternalAuthor, ResearchOutputResponse } from '@asap-hub/model';
import { CsvFormatterStream, Row, format } from '@fast-csv/format';
import { WritableStream } from 'web-streams-polyfill/ponyfill';
import streamSaver from 'streamsaver';

import { GetListOptions } from '../api-util';

export const MAX_ALGOLIA_RESULTS = 10000;
export const EXCEL_CELL_CHARACTER_LIMIT = 32767;
const EXCEL_CELL_SAFE_CHARACTER_LIMIT = Math.floor(
  (EXCEL_CELL_CHARACTER_LIMIT - 2) / 2, // Cell likely wrapped with ""; " escapes to ""
);

type ResearchOutputCSV = Record<
  keyof Omit<ResearchOutputResponse, 'team'>,
  string | undefined | boolean
>;

const htmlToCsvText = (html: string = '') => {
  const doc = document.createElement('DIV');
  doc.innerHTML = html;
  return (doc.textContent || doc.innerText || '').substring(
    0,
    EXCEL_CELL_SAFE_CHARACTER_LIMIT,
  );
};

const caseInsensitive = (a: string, b: string) =>
  a.localeCompare(b, undefined, { sensitivity: 'base' });

export const researchOutputToCSV = (
  output: ResearchOutputResponse,
): ResearchOutputCSV => ({
  title: output.title,
  type: output.type,
  subTypes: output.subTypes.join(','),
  addedDate: output.addedDate,
  lastUpdatedPartial: output.lastUpdatedPartial,
  teams: output.teams
    .map((team) => team.displayName)
    .sort(caseInsensitive)
    .join(','),
  labs: output.labs
    .map((lab) => lab.name)
    .sort(caseInsensitive)
    .join(','),
  authors: output.authors
    .map(
      (user) =>
        `${user.displayName}${user.orcid ? ` (${user.orcid})` : ''}${
          isInternalAuthor(user) ? '' : ' [ext]'
        }`,
    )
    .join(','),
  tags: output.tags
    .map((item) => item)
    .sort(caseInsensitive)
    .join(','),
  usedInPublication: output.usedInPublication,
  sharingStatus: output.sharingStatus,
  asapFunded: output.asapFunded,
  link: output.link,
  doi: output.doi,
  rrid: output.rrid,
  accession: output.accession,
  labCatalogNumber: output.labCatalogNumber,
  description: htmlToCsvText(output.description),
  accessInstructions: htmlToCsvText(output.accessInstructions),
  contactEmails: output.contactEmails
    .map((item) => item)
    .sort(caseInsensitive)
    .join(','),
  publishDate: output.publishDate,
  id: output.id,
  created: output.created,
  lastModifiedDate: output.lastModifiedDate,
});

export const createCsvFileStream = (
  csvOptions: Parameters<typeof format>[0],
  fileName: string,
) => {
  const csvStream = format({ writeBOM: true, ...csvOptions });
  // If the WritableStream is not available (Firefox, Safari), take it from the ponyfill
  if (!window.WritableStream) {
    streamSaver.WritableStream = WritableStream;
  }
  const fileWriter = streamSaver.createWriteStream(fileName).getWriter();
  csvStream
    .on('data', (data) => fileWriter.write(data))
    .on('end', () => fileWriter.close());
  return csvStream;
};

export const algoliaResultsToStream = async <
  TEntity extends Record<string, unknown>,
  TEntityName extends string,
>(
  csvStream: CsvFormatterStream<Row, Row>,
  getResults: ({
    currentPage,
    pageSize,
  }: Pick<GetListOptions, 'currentPage' | 'pageSize'>) => Readonly<
    Promise<SearchResponse<TEntity, TEntityName>>
  >,
  transform: (result: TEntity) => Row,
) => {
  let morePages = true;
  let currentPage = 0;
  while (morePages) {
    // We are doing this in chunks and streams to avoid blob/ram limits.
    // eslint-disable-next-line no-await-in-loop
    const data = await getResults({
      currentPage,
      pageSize: MAX_ALGOLIA_RESULTS,
    });
    data.hits.map(transform).forEach((row) => csvStream.write(row));
    currentPage += 1;
    morePages = currentPage <= data.nbPages - 1;
  }
  csvStream.end();
};
