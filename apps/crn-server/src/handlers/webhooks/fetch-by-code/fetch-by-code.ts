import { validateAuth0Request } from '@asap-hub/server-common';
import { framework as lambda } from '@asap-hub/services-common';
import { SearchClient } from 'algoliasearch';
import {
  algoliaApiKey,
  algoliaApiKeyTtl,
  auth0SharedSecret,
} from '../../../config';
import { UserController } from '../../../controllers/users';
import { validateParams } from '../../../validation/fetch-by-code.validation';

export const fetchUserByCodeHandlerFactory = (
  userController: UserController,
  algoliaClient: SearchClient,
  date = new Date(),
  ttl = algoliaApiKeyTtl,
): lambda.Handler =>
  lambda.http(async (request) => {
    await validateAuth0Request(request, auth0SharedSecret);

    const { code } = validateParams(request.params as never);

    const user = await userController.fetchByCode(code);
    const apiKey = algoliaClient.generateSecuredApiKey(algoliaApiKey, {
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
