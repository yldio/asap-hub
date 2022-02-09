import { SearchIndex as AlgoliaSearchIndex } from 'algoliasearch';

import { WaitablePromise } from '@algolia/client-common';
import { DeleteResponse, SaveObjectResponse } from '@algolia/client-search';

export abstract class SearchIndex<TObject, TEntityName extends string> {
  public constructor(protected index: AlgoliaSearchIndex) {
    // do nothing
  }

  protected abstract getEntityName(): TEntityName;

  protected deleteObject(
    entityId: string,
  ): Readonly<WaitablePromise<DeleteResponse>> {
    return this.index.deleteObject(entityId);
  }

  protected saveObject(
    entityId: string,
    entity: TObject,
  ): Readonly<WaitablePromise<SaveObjectResponse>> {
    return this.index.saveObject({
      ...entity,
      objectID: entityId,
      __meta: { type: this.getEntityName() },
    });
  }
}
