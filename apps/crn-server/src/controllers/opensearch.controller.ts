import { UserResponse } from '@asap-hub/model';
import { OpenSearchRequest, OpenSearchResponse } from '@asap-hub/server-common';
import OpenSearchProvider from '../data-providers/opensearch.data-provider';

export default class OpenSearchController {
  constructor(private opensearchProvider: OpenSearchProvider) {}

  async search(
    index: string,
    body: OpenSearchRequest,
    loggedInUser: UserResponse,
  ): Promise<OpenSearchResponse> {
    return this.opensearchProvider.search({
      index,
      body,
      loggedInUser,
    });
  }
}
