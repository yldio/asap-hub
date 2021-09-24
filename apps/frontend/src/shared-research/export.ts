import { ResearchOutputResponse } from '@asap-hub/model';

type ResearchOutputCSV = Record<
  keyof Omit<ResearchOutputResponse, 'team'>,
  string | undefined | boolean
>;

export const researchOutputToCSV = (
  output: ResearchOutputResponse,
): ResearchOutputCSV => ({
  id: output.id,
  title: output.title,
  type: output.type,
  subTypes: output.subTypes.join(','),
  tags: output.tags.join(','),
  link: output.link,
  publishDate: output.publishDate,
  labCatalogNumber: output.labCatalogNumber,
  doi: output.doi,
  accession: output.accession,
  addedDate: output.addedDate,
  rrid: output.rrid,
  lastModifiedDate: output.lastModifiedDate,
  accessInstructions: output.accessInstructions,
  asapFunded: output.asapFunded,
  usedInPublication: output.usedInPublication,
  authors: output.authors.map((author) => author.displayName).join(','),
  teams: output.teams.map((team) => team.displayName).join(','),
  labs: output.labs.map((lab) => lab.name).join(','),
  pmsEmails: output.pmsEmails.join(','),
  created: output.created,
  description: output.description,
  lastUpdatedPartial: output.lastUpdatedPartial,
  sharingStatus: output.sharingStatus,
});
