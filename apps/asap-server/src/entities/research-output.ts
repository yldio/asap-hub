import { ResearchOutputResponse } from '@asap-hub/model';
import { GraphqlResearchOutput } from '@asap-hub/squidex';

import { parseDate } from '../utils/squidex';

export const parseGraphQLResearchOutput = (
  output: GraphqlResearchOutput,
): ResearchOutputResponse => {
  return {
    id: output.id,
    created: parseDate(output.created).toISOString(),
    link: output.flatData?.link || undefined,
    type: output.flatData?.type || 'Proposal',
    title: output.flatData?.title || '',
    text: output.flatData?.text || '',
    publishDate: output.flatData?.publishDate || undefined,
  };
};
