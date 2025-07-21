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
}
