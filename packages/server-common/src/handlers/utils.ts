import {
  AlgoliaClient,
  Apps,
  gp2 as gp2Algolia,
  Payload,
  SavePayload,
} from '@asap-hub/algolia';
import { EventResponse, ListResponse, UserResponse } from '@asap-hub/model';
import { Logger } from '../utils';

type PayloadType<T> = T extends SavePayload ? T['type'] : never;

const isEventResponse = (data: SavePayload['data']): data is EventResponse =>
  (data as EventResponse).hidden !== undefined;
export const eventFilter = <T extends SavePayload['data']>(event: T) =>
  isEventResponse(event) && !event.hidden;

const isUserResponse = (data: SavePayload['data']): data is UserResponse =>
  (data as UserResponse).onboarded !== undefined;
export const userFilter = <T extends SavePayload['data']>(user: T) =>
  isUserResponse(user) && user.onboarded && user.role !== 'Hidden';

export const createProcessingFunction =
  <T extends Payload | gp2Algolia.Payload, Type extends PayloadType<T>>(
    algoliaClient: AlgoliaClient<Apps>,
    type: Type,
    logger: Logger,
    filterFunction: (item: T['data']) => boolean = () => true,
  ) =>
  async (found: ListResponse<T['data']>) => {
    logger.info(
      `Found ${found.total} items. Processing ${found.items.length} ${type}s.`,
    );

    try {
      const payload = found.items.filter(filterFunction).map(
        (data) =>
          ({
            data,
            type,
          } as SavePayload),
      );
      logger.debug(`trying to save: ${JSON.stringify(payload, null, 2)}`);
      await algoliaClient.saveMany(payload);
    } catch (err) {
      logger.error('Error occurred during saveMany');
      if (err instanceof Error) {
        logger.error(`The error message: ${err.message}`);
      }
      throw err;
    }

    logger.info(`Updated ${found.items.length} items.`);
  };
