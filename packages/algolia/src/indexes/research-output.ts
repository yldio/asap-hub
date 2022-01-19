import { WaitablePromise } from '@algolia/client-common';
import {
  DeleteResponse,
  SaveObjectResponse,
  SearchOptions,
} from '@algolia/client-search';

import { ResearchOutputResponse } from '@asap-hub/model';
import { SearchIndex } from './search-index';
import { SearchResponse, SearchResponseEntity } from '../types/response';

export type ResearchOutputSearchResponse = SearchResponse<
  ResearchOutputResponse,
  'research-output'
>;
export type ResearchOutputSearchResponseEntity = SearchResponseEntity<
  ResearchOutputResponse,
  'research-output'
>;

export class ResearchOutputSearchIndex extends SearchIndex<
  ResearchOutputResponse,
  'research-output'
> {
  public remove(entityId: string): Readonly<WaitablePromise<DeleteResponse>> {
    return this.deleteObject(entityId);
  }

  public save(
    researchOutput: ResearchOutputResponse,
  ): Readonly<WaitablePromise<SaveObjectResponse>> {
    return this.saveObject(researchOutput.id, researchOutput);
  }

  public async search(
    query: string,
    requestOptions?: SearchOptions,
  ): Promise<ResearchOutputSearchResponse> {
    return this.index.search<ResearchOutputSearchResponseEntity>(
      query,
      requestOptions,
    );
  }

  // eslint-disable-next-line class-methods-use-this
  protected getEntityName(): 'research-output' {
    return 'research-output';
  }
}
