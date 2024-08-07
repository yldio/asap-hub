import { UserMetadataResponse } from '@asap-hub/model';
import { validateAuth0Request } from '@asap-hub/server-common';
import { framework as lambda } from '@asap-hub/services-common';
import { SearchClient } from 'algoliasearch';
import {
  algoliaApiKey,
  algoliaApiKeyTtl,
  auth0SharedSecret,
} from '../../../config';
import UserController from '../../../controllers/user.controller';
import { validateParams } from '../../../validation/fetch-by-code.validation';

export const fetchUserByCodeHandlerFactory = (
  userController: UserController,
  algoliaClient: SearchClient,
  date = new Date(),
  ttl = algoliaApiKeyTtl,
): lambda.Handler =>
  lambda.http<UserMetadataResponse>(async (request) => {
    validateAuth0Request(request, auth0SharedSecret);

    const { code } = validateParams(request.params as never);

    const user = await userController.fetchByCode(code);

    const apiKey = user.onboarded
      ? algoliaClient.generateSecuredApiKey(algoliaApiKey, {
          validUntil: getValidUntilTimestampInSeconds({
            date,
            ttl,
          }),
        })
      : null;

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
