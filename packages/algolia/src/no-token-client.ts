import { SearchOptions } from '@algolia/client-search';
import { SearchIndex } from 'algoliasearch';
import {
  Apps,
  ClientSearchResponse,
  EntityResponses,
  SavePayload,
  SearchClient,
} from './client';

export const EMPTY_ALGOLIA_RESPONSE = {
  items: [],
  total: 0,
  algoliaIndexName: '',
  algoliaQueryId: '',
  processingTimeMS: 0,
  hitsPerPage: 0,
  nbHits: 0,
  nbPages: 0,
  page: 0,
  hits: [],
  exhaustiveNbHits: false,
  query: '',
  params: '',
};

/*
    This is a dummy client that is used when the Algolia API key is not available so that the app does not crash.
    It is used in case the user is not onboarded yet.
*/

export class NoTokenAlgoliaClient<App extends Apps> implements SearchClient {
  constructor(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    private _index: SearchIndex | string,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    private _reverseEventsIndex: SearchIndex | string,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    private _userToken?: SearchOptions['userToken'],
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    private _clickAnalytics?: SearchOptions['clickAnalytics'],
  ) {} // eslint-disable-line no-empty-function

  // eslint-disable-next-line class-methods-use-this
  async save(_payload: SavePayload) {
    throw new Error('Saving is not allowed for this client');
  }
  // eslint-disable-next-line class-methods-use-this
  async saveMany(_payload: SavePayload[]) {
    throw new Error('Saving many is not allowed for this client');
  }

  // eslint-disable-next-line class-methods-use-this
  async remove(_id: string) {
    throw new Error('Removing is not allowed for this client');
  }

  // eslint-disable-next-line class-methods-use-this
  async search<ResponsesKey extends keyof EntityResponses[App]>(
    _entityTypes: ResponsesKey[],
    _query: string,
    _requestOptions?: SearchOptions,
    _descendingEvents?: boolean,
  ): Promise<ClientSearchResponse<App, ResponsesKey>> {
    return EMPTY_ALGOLIA_RESPONSE as ClientSearchResponse<App, ResponsesKey>;
  }
}
