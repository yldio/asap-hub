import { EntityResponses, SearchEntityResponse } from '@asap-hub/algolia';
import { ResearchOutputResponse } from '@asap-hub/model';
import { isInternalUser } from '@asap-hub/validation';
/* eslint-disable-next-line import/no-unresolved */
import { stringify, Options, Stringifier } from 'csv-stringify/browser/esm';
import { WritableStream } from 'web-streams-polyfill/ponyfill';
import streamSaver from 'streamsaver';

import { GetListOptions } from '@asap-hub/frontend-utils';

export const MAX_ALGOLIA_RESULTS = 10000;
export const EXCEL_CELL_CHARACTER_LIMIT = 32767;
const EXCEL_CELL_SAFE_CHARACTER_LIMIT = Math.floor(
  (EXCEL_CELL_CHARACTER_LIMIT - 2) / 2, // Cell likely wrapped with ""; " escapes to ""
);

type CSVValue = string | undefined | boolean;

type ResearchOutputCSV = Record<
  keyof Omit<ResearchOutputResponse, 'team'>,
  CSVValue
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
  documentType: output.documentType,
  type: output.type,
  subtype: output.subtype,
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
          isInternalUser(user) ? '' : ' [ext]'
        }`,
    )
    .join(','),
  methods: output.methods
    .map((item) => item)
    .sort(caseInsensitive)
    .join(','),
  organisms: output.organisms
    .map((item) => item)
    .sort(caseInsensitive)
    .join(','),
  environments: output.environments
    .map((item) => item)
    .sort(caseInsensitive)
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
  usageNotes: htmlToCsvText(output.usageNotes),
  contactEmails: output.contactEmails
    .map((item) => item)
    .sort(caseInsensitive)
    .join(','),
  publishDate: output.publishDate,
  id: output.id,
  created: output.created,
  lastModifiedDate: output.lastModifiedDate,
});

export const createCsvFileStream = (fileName: string, csvOptions?: Options) => {
  // If the WritableStream is not available (Firefox, Safari), take it from the ponyfill
  if (!window.WritableStream) {
    streamSaver.WritableStream = WritableStream;
  }
  const fileWriter = streamSaver.createWriteStream(fileName).getWriter();
  const stringifier = stringify({ bom: true, ...csvOptions });
  return stringifier
    .on('readable', () => {
      let row;
      while ((row = stringifier.read()) !== null) {
        fileWriter.write(row);
      }
    })
    .on('end', () => fileWriter.close());
};

export const algoliaResultsToStream = async <T extends keyof EntityResponses>(
  csvStream: Stringifier,
  getResults: ({
    currentPage,
    pageSize,
  }: Pick<GetListOptions, 'currentPage' | 'pageSize'>) => Readonly<
    Promise<SearchEntityResponse<T>>
  >,
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  transform: (result: EntityResponses[T]) => Record<string, any>,
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
