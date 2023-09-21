import { AlgoliaClient, gp2, SavePayload } from '@asap-hub/algolia';
import { ListResponse } from '@asap-hub/model';
import logger from '../utils/logger';

type PayloadType<T> = T extends gp2.Payload ? T['type'] : never;

export const createProcessingFunction =
  <T extends gp2.Payload, Type extends PayloadType<T>>(
    algoliaClient: AlgoliaClient<'gp2'>,
    type: Type,
  ) =>
  async (found: ListResponse<T['data']>) => {
    logger.info(
      `Found ${found.total} items. Processing ${found.items.length} ${type}s.`,
    );

    try {
      const payload = found.items.map(
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
