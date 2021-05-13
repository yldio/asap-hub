import { ResearchOutputResponse } from '@asap-hub/model';
import { GraphqlResearchOutput, RestResearchOutput } from '@asap-hub/squidex';

import { parseDate } from '../utils/squidex';

export const parseResearchOutput = (
  output: RestResearchOutput,
): Omit<ResearchOutputResponse, 'teams'> => ({
  id: output.id,
  created: output.created,
  link: output.data.link?.iv || undefined,
  type: output.data.type.iv,
  title: output.data.title.iv,
  description: output.data.description?.iv || '',
  publishDate: output.data.publishDate?.iv,
  addedDate: output.data.addedDate?.iv,
  tags: output.data.tags?.iv || [],
  lastUpdatedPartial:
    output.data.lastUpdatedPartial?.iv || output.lastModified || output.created,
  accessInstructions: output.data.accessInstructions?.iv,
});

export const parseGraphQLResearchOutput = (
  output: GraphqlResearchOutput,
): Omit<ResearchOutputResponse, 'teams'> => ({
  id: output.id,
  created: parseDate(output.created).toISOString(),
  link: output.flatData?.link || undefined,
  type: output.flatData?.type || 'Proposal',
  title: output.flatData?.title || '',
  description: output.flatData?.description || '',
  tags: output.flatData?.tags || [],
  publishDate: output.flatData?.publishDate || undefined,
  addedDate: output.flatData?.addedDate || undefined,
  lastUpdatedPartial:
    output.flatData?.lastUpdatedPartial ||
    output.lastModified ||
    output.created,
});
