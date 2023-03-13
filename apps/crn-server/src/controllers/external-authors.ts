import {
  ListExternalAuthorResponse,
  ExternalAuthorResponse,
  FetchOptions,
} from '@asap-hub/model';
import { ExternalAuthorDataProvider } from '../data-providers/external-authors.data-provider';

export interface ExternalAuthorsController {
  fetch(options: FetchOptions): Promise<ListExternalAuthorResponse>;
  fetchById(id: string): Promise<ExternalAuthorResponse>;
}

export default class ExternalAuthors implements ExternalAuthorsController {
  constructor(private externalAuthorDataProvider: ExternalAuthorDataProvider) {}

  async fetch(options: FetchOptions): Promise<ListExternalAuthorResponse> {
    return this.externalAuthorDataProvider.fetch(options);
  }

  async fetchById(id: string): Promise<ExternalAuthorResponse> {
    return this.externalAuthorDataProvider.fetchById(id);
  }
}
