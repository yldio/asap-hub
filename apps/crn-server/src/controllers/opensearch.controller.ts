import { OpenSearchRequest, OpenSearchResponse } from '@asap-hub/server-common';
import OpenSearchProvider from '../data-providers/opensearch-provider';

export default class OpenSearchController {
  constructor(private opensearchProvider: OpenSearchProvider) {}

  async search(
    index: string,
    body: OpenSearchRequest,
  ): Promise<OpenSearchResponse> {
    return this.opensearchProvider.search({
      index,
      body,
    });
  }

  async update(
    index: string,
    id: string,
    body: {
      userId: string;
      doc_as_upsert?: boolean;
    },
  ): Promise<OpenSearchResponse> {
    return this.opensearchProvider.update({
      index,
      id,
      body: {
        doc_as_upsert: body.doc_as_upsert ?? false,
        userId: body.userId,
      },
    });
  }
}
