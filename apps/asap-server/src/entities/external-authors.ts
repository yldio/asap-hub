import { ExternalAuthorResponse } from '@asap-hub/model';
import { GraphqlExternalAuthor } from '@asap-hub/squidex';

export const parseGraphQLExternalAuthor = (
  item: GraphqlExternalAuthor,
): ExternalAuthorResponse => ({
  id: item.id,
  orcid: item.flatData?.orcid || undefined,
  displayName: item.flatData?.name || '',
});
