import { caseInsensitive, CSVValue } from '@asap-hub/frontend-utils';
import { gp2 } from '@asap-hub/model';
import { formatDate } from '@asap-hub/react-components';
import { isInternalUser } from '@asap-hub/validation';
import { Stringifier } from 'csv-stringify/browser/esm';

export const outputFields = {
  title: 'Title',
  documentType: 'Document Type',
  type: 'Type',
  subtype: 'Subtype',
  link: 'Link',
  authors: 'Authors',
  description: 'Description',
  shortDescription: 'Short Description',
  relatedResearch: 'Related Research',
  relatedEvents: 'Related Events',
  tags: 'Tags',
  contributingCohorts: 'Contributing Cohorts',
  workingGroups: 'Working Groups',
  projects: 'Projects',
  date: 'Date Added',
  gp2Supported: 'GP2 Supported',
  sharingStatus: 'Sharing Status',
  doi: 'DOI',
  rrid: 'RRID',
  accession: 'Accession',
  publishDate: 'Publish Date',
  lastUpdatedPartial: 'Last Updated Partial',
  firstVersionTitle: 'First Version Title',
  firstVersionType: 'First Version Type',
  firstVersionRRID: 'First Version RRID',
  firstVersionAccession: 'First Version Accession',
  firstVersionLink: 'First Version Link',
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
  workingGroups,
  projects,
  addedDate,
  tags,
  contributingCohorts,
  description,
  shortDescription,
  relatedEvents,
  relatedOutputs,
  gp2Supported,
  sharingStatus,
  doi,
  rrid,
  accessionNumber,
  publishDate,
  lastUpdatedPartial,
  versions,
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
  contributingCohorts:
    sorted(contributingCohorts?.map(({ name }) => name)) || '',
  workingGroups:
    sorted(workingGroups?.map((workingGroup) => workingGroup.title)) || '',
  projects: sorted(projects?.map((project) => project.title)) || '',
  date: formatDate(new Date(addedDate)),
  description,
  shortDescription,
  relatedEvents: sorted(relatedEvents.map((event) => event.title)) || '',
  relatedResearch: sorted(relatedOutputs.map((event) => event.title)) || '',
  gp2Supported: gp2Supported ? 'yes' : 'no',
  sharingStatus: sharingStatus,
  doi,
  rrid,
  accession: accessionNumber,
  publishDate,
  lastUpdatedPartial,
  ...getVersionFields(versions),
});

export const getVersionFields = (versions?: gp2.OutputVersion[]) => {
  if (versions && versions.length > 0) {
    return {
      firstVersionTitle: versions[0]?.title,
      firstVersionType: versions[0]?.type,
      firstVersionRRID: versions[0]?.rrid,
      firstVersionAccession: versions[0]?.accessionNumber,
      firstVersionLink: versions[0]?.link,
    };
  } else {
    return {
      firstVersionTitle: '',
      firstVersionType: '',
      firstVersionRRID: '',
      firstVersionAccession: '',
      firstVersionLink: '',
    };
  }
};

export const outputsResponseToStream = async (
  csvStream: Stringifier,
  getResults: ({
    pageSize,
    currentPage,
  }: {
    pageSize: number;
    currentPage: number;
  }) => Readonly<Promise<gp2.ListOutputResponse>>,
  transform: (result: gp2.OutputResponse) => Record<string, unknown>,
) => {
  let morePages = true;
  let currentPage = 0;
  while (morePages) {
    // We are doing this in chunks and streams to avoid blob/ram limits.
    // eslint-disable-next-line no-await-in-loop
    const data = await getResults({
      currentPage,
      pageSize: MAX_RESULTS,
    });
    data.items.map(transform).forEach((row) => csvStream.write(row));
    currentPage += 1;
    morePages = currentPage * MAX_RESULTS < data.total;
  }
  csvStream.end();
};
