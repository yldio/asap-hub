/* istanbul ignore file */
import { Writable } from 'stream';
import algoliasearch, { SearchIndex } from 'algoliasearch';

import { RestUser } from '@asap-hub/squidex';

import { Migration } from '../handlers/webhooks/webhook-run-migrations';
import {
  applyToAllItemsInCollection,
  CollectionStream,
  ChunkedCollectionStream,
  CollectionEntityTypeMapper,
  executeStreamCallback,
} from '../utils/migrations';

const algoliaAppId = 'test';
const algoliaCiApiKey = 'test';
const algoliaSearchClient = algoliasearch(algoliaAppId, algoliaCiApiKey);

const getCollectionStream = (): ChunkedCollectionStream<'users'> =>
  new CollectionStream<'users'>(applyToAllItemsInCollection('users')).pipe(
    new ChunkedCollectionStream<'users'>(),
  );

const indexUser =
  (algoliaUsersIndex: SearchIndex) =>
  (users: CollectionEntityTypeMapper<'users'>[]): unknown =>
    algoliaUsersIndex.saveObjects(
      users.map((user: RestUser) => ({
        ...user,
        objectID: user.id,
      })),
    );

const removeUser =
  (algoliaUsersIndex: SearchIndex) =>
  (users: CollectionEntityTypeMapper<'users'>[]): unknown =>
    algoliaUsersIndex.deleteObjects(users.map(({ id }: RestUser) => id));

export default class MoveResearchOutputTextToDescription extends Migration {
  up = async (): Promise<void> => {
    await new Promise((resolve) => {
      getCollectionStream()
        .pipe(
          new Writable({
            write: executeStreamCallback<RestUser[]>(
              indexUser(algoliaSearchClient.initIndex('users')),
            ),
          }),
        )
        .on('end', resolve);
    });
  };

  down = async (): Promise<void> => {
    await new Promise((resolve) => {
      getCollectionStream()
        .pipe(
          new Writable({
            write: executeStreamCallback<RestUser[]>(
              removeUser(algoliaSearchClient.initIndex('users')),
            ),
          }),
        )
        .on('end', resolve);
    });
  };
}
