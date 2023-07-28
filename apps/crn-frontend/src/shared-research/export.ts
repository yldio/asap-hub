import { EntityResponses, SearchEntityResponse } from '@asap-hub/algolia';
import { ListResponse, ResearchOutputResponse } from '@asap-hub/model';
import { isInternalUser } from '@asap-hub/validation';
/* eslint-disable-next-line import/no-unresolved */
import { Stringifier } from 'csv-stringify/browser/esm';
import {
  caseInsensitive,
  CSVValue,
  GetListOptions,
  htmlToCsvText,
} from '@asap-hub/frontend-utils';

export const MAX_ALGOLIA_RESULTS = 10000;
// https://github.com/Squidex/squidex/blob/master/backend/src/Squidex/appsettings.json#L266
export const MAX_SQUIDEX_RESULTS = 200;

type ResearchOutputCSV = Record<
  keyof Omit<
    ResearchOutputResponse,
    'team' | 'descriptionMD' | 'usageNotesMD' | 'versions'
  >,
  CSVValue
>;

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
  relatedResearch: output.relatedResearch.map(({ title }) => title).join(','),
  relatedEvents: output.relatedEvents.map(({ title }) => title).join(','),
  workingGroups: output.workingGroups
    ? output.workingGroups
        .map((wg) => wg.title)
        .sort(caseInsensitive)
        .join(',')
    : '',
  methods: output.methods
    .map((item) => item)
    .sort(caseInsensitive)
    .join(','),
  keywords: output.keywords
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
  usedInPublication: output.usedInPublication,
  sharingStatus: output.sharingStatus,
  asapFunded: output.asapFunded,
  link: output.link,
  doi: output.doi,
  rrid: output.rrid,
  accession: output.accession,
  labCatalogNumber: output.labCatalogNumber,
  description: [htmlToCsvText(output.description), output.descriptionMD]
    .filter((item) => item && item.length !== 0)
    .join(' '),
  usageNotes: output.usageNotesMD || htmlToCsvText(output.usageNotes),
  contactEmails: output.contactEmails
    .map((item) => item)
    .sort(caseInsensitive)
    .join(','),
  publishDate: output.publishDate,
  id: output.id,
  created: output.created,
  lastModifiedDate: output.lastModifiedDate,
  published: output.published,
  statusChangedBy: output.statusChangedBy
    ? `${output.statusChangedBy.firstName} ${output.statusChangedBy.lastName}`
    : undefined,
  statusChangedAt: output.statusChangedAt,
  isInReview: output.isInReview,
});

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

export const squidexResultsToStream = async <T>(
  csvStream: Stringifier,
  getResults: ({
    currentPage,
    pageSize,
  }: Pick<GetListOptions, 'currentPage' | 'pageSize'>) => Readonly<
    Promise<ListResponse<T>>
  >,
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  transform: (result: T) => Record<string, any>,
) => {
  let morePages = true;
  let currentPage = 0;
  while (morePages) {
    // We are doing this in chunks and streams to avoid blob/ram limits.
    // eslint-disable-next-line no-await-in-loop
    const data = await getResults({
      currentPage,
      pageSize: MAX_SQUIDEX_RESULTS,
    });
    data.items.map(transform).forEach((row) => csvStream.write(row));
    currentPage += 1;
    morePages = currentPage * MAX_SQUIDEX_RESULTS < data.total;
  }
  csvStream.end();
};
