import { SearchClient } from 'algoliasearch';
import Joi from '@hapi/joi';
import { config as auth0Config, management } from '@asap-hub/auth';
import { UserMetadataResponse } from '@asap-hub/model';
import { framework as lambda } from '@asap-hub/services-common';
import { http } from '../../../utils/instrumented-framework';
import { UserController } from '../../../controllers/users';
import validateRequest from '../../../utils/validate-auth0-request';
import { Handler } from '../../../utils/types';
import {
  algoliaApiKeyTtl as algoliaApiKeyDefaultTtl,
  algoliaSearchApiKey,
} from '../../../config';

const algoliaApiKeyTtlExtensionInSeconds = 60;

export const fetchUserByCodeHandlerFactory = (
  userController: UserController,
  algoliaClient: SearchClient,
): Handler =>
  http(async (request: lambda.Request): Promise<
    lambda.Response<UserMetadataResponse>
  > => {
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

    const auth0ServerCurrentTimestamp =
      +(request.headers[auth0Config.currentTimestampHeader] || 0) || Date.now();
    const auth0TokenTtl =
      (await management.getJWTConfiguration())?.lifetimeInSeconds ||
      algoliaApiKeyDefaultTtl;
    const algoliaApiKeyTtl = auth0TokenTtl + algoliaApiKeyTtlExtensionInSeconds;

    const apiKey = algoliaClient.generateSecuredApiKey(algoliaSearchApiKey, {
      validUntil: auth0ServerCurrentTimestamp + algoliaApiKeyTtl, // which is one minute over the TTL of the ID token
    });

    return {
      payload: {
        ...user,
        algoliaApiKey: apiKey,
      },
    };
  });
