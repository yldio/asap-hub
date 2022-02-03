import { SearchClient } from 'algoliasearch';
import Joi from '@hapi/joi';
import { framework as lambda } from '@asap-hub/services-common';
import { UserController } from '../../../controllers/users';
import validateRequest from '../../../utils/validate-auth0-request';
import { Handler } from '../../../utils/types';
import { algoliaApiKeyTtl, algoliaSearchApiKey } from '../../../config';

export const fetchUserByCodeHandlerFactory = (
  userController: UserController,
  algoliaClient: SearchClient,
  date = new Date(),
  ttl = algoliaApiKeyTtl,
): Handler =>
  lambda.http(async (request) => {
    await validateRequest(request);

    const paramsSchema = Joi.object({
      code: Joi.string().required(),
    }).required();

    const { code } = lambda.validate(
      'params',
      request.params,
      paramsSchema,
    ) as {
      code: string;
    };

    const user = await userController.fetchByCode(code);
    const apiKey = algoliaClient.generateSecuredApiKey(algoliaSearchApiKey, {
      validUntil: getValidUntilTimestampInSeconds({
        date,
        ttl,
      }),
    });

    return {
      payload: {
        ...user,
        algoliaApiKey: apiKey,
      },
    };
  });

export type GetValidUntilTimestampInSecondsArgs = {
  date: Date;
  ttl: number;
};

export const getValidUntilTimestampInSeconds = ({
  date,
  ttl,
}: GetValidUntilTimestampInSecondsArgs): number =>
  Math.floor(date.getTime() / 1000) + Math.floor(ttl);
