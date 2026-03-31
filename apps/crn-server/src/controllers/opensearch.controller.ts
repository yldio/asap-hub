import { OpensearchRequest, OpensearchResponse } from '@asap-hub/server-common';
import OpensearchProvider from '../data-providers/opensearch.data-provider';

export default class OpensearchController {
  constructor(private opensearchProvider: OpensearchProvider) {}

  async search(
    index: string,
    body: OpensearchRequest,
  ): Promise<OpensearchResponse> {
    return this.opensearchProvider.search({ index, body });
  }
}
