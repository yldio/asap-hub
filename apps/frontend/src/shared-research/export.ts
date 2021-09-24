import { isInternalAuthor, ResearchOutputResponse } from '@asap-hub/model';

type ResearchOutputCSV = Record<
  keyof Omit<ResearchOutputResponse, 'team'>,
  string | undefined | boolean
>;

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
  labs: (output.labs ?? [])
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
  description: output.description,
  accessInstructions: output.accessInstructions,
  pmsEmails: output.pmsEmails
    .map((item) => item)
    .sort(caseInsensitive)
    .join(','),
  publishDate: output.publishDate,
  id: output.id,
  created: output.created,
  lastModifiedDate: output.lastModifiedDate,
});
