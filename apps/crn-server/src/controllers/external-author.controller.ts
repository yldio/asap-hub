import { NotFoundError } from '@asap-hub/errors';
import {
  ListExternalAuthorResponse,
  ExternalAuthorResponse,
  FetchOptions,
} from '@asap-hub/model';
import { ExternalAuthorDataProvider } from '../data-providers/external-authors.data-provider';

export default class ExternalAuthorController {
  constructor(private externalAuthorDataProvider: ExternalAuthorDataProvider) {}

  async fetch(options: FetchOptions): Promise<ListExternalAuthorResponse> {
    return this.externalAuthorDataProvider.fetch(options);
  }

  async fetchById(id: string): Promise<ExternalAuthorResponse> {
    const author = await this.externalAuthorDataProvider.fetchById(id);

    if (!author) {
      throw new NotFoundError(undefined, `Author with id ${id} not found.`);
    }

    return author;
  }
}
