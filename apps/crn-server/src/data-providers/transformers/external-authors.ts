import { ExternalAuthorDataObject } from '@asap-hub/model';
import { GraphqlExternalAuthor } from '@asap-hub/squidex';

export const parseGraphQLExternalAuthor = (
  item: GraphqlExternalAuthor,
): ExternalAuthorDataObject => ({
  id: item.id,
  orcid: item.flatData?.orcid || undefined,
  displayName: item.flatData?.name || '',
});
