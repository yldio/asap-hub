import {
  caseInsensitive,
  CSVValue,
  GetListOptions,
  htmlToCsvText,
} from '@asap-hub/frontend-utils';
import {
  ListResponse,
  ResearchOutputResponse,
  ResearchOutputVersion,
} from '@asap-hub/model';
import { isInternalUser } from '@asap-hub/validation';
import { Stringifier } from 'csv-stringify/browser/esm';

export const MAX_ALGOLIA_RESULTS = 1000;
// Max Complexity 11000. Research Outputs are the most complex entity. 554 11000/554 = 19.8. 15 seems safe.
export const MAX_CONTENTFUL_RESULTS = 15;

type FirstVersionCSV = {
  firstVersionTitle: string;
  firstVersionType: string;
  firstVersionRrid: string;
  firstVersionAccession: string;
  firstVersionLink: string;
};

type ResearchOutputCSV = Record<
  keyof (Omit<
    ResearchOutputResponse,
    'team' | 'descriptionMD' | 'usageNotesMD' | 'versions'
  > &
    FirstVersionCSV),
  CSVValue
>;

const getFirstVersionData = (
  versions: Array<ResearchOutputVersion>,
): FirstVersionCSV => {
  if (versions[0]) {
    const {
      title,
      type = '',
      rrid = '',
      accession = '',
      link = '',
    } = versions[0];
    return {
      firstVersionTitle: title,
      firstVersionType: type,
      firstVersionRrid: rrid,
      firstVersionAccession: accession,
      firstVersionLink: link,
    };
  }

  return {
    firstVersionTitle: '',
    firstVersionType: '',
    firstVersionRrid: '',
    firstVersionAccession: '',
    firstVersionLink: '',
  };
};

export const researchOutputToCSV = (
  output: ResearchOutputResponse,
): ResearchOutputCSV => ({
  title: output.title,
  documentType: output.documentType,
  type: output.type,
  subtype: output.subtype,
  addedDate: output.addedDate,
  lastUpdatedPartial: output.lastUpdatedPartial,
  publishingEntity: output.publishingEntity,
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
  researchTheme: output.researchTheme?.join(','),
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
  description: output.descriptionMD || htmlToCsvText(output.description),
  shortDescription: output.shortDescription,
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
  ...getFirstVersionData(output.versions),
});

export const squidexResultsToStream = async <T>(
  csvStream: Stringifier,
  getResults: ({
    currentPage,
    pageSize,
  }: Pick<GetListOptions, 'currentPage' | 'pageSize'>) => Readonly<
    Promise<ListResponse<T>>
  >,
  transform: (result: T) => Record<string, unknown>,
) => {
  let morePages = true;
  let currentPage = 0;
  while (morePages) {
    // We are doing this in chunks and streams to avoid blob/ram limits.
    // eslint-disable-next-line no-await-in-loop
    const data = await getResults({
      currentPage,
      pageSize: MAX_CONTENTFUL_RESULTS,
    });
    data.items.map(transform).forEach((row) => csvStream.write(row));
    currentPage += 1;
    morePages = currentPage * MAX_CONTENTFUL_RESULTS < data.total;
  }
  csvStream.end();
};
