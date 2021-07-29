import { SearchClient } from 'algoliasearch';
import Joi from '@hapi/joi';
import { framework as lambda } from '@asap-hub/services-common';
import { UserMetadataResponse } from '@asap-hub/model';
import { http } from '../../../utils/instrumented-framework';
import { UserController } from '../../../controllers/users';
import validateRequest from '../../../utils/validate-auth0-request';
import { Handler } from '../../../utils/types';
import { algoliaSearchApiKey } from '../../../config';
import logger from '../../../utils/logger';

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
    let apiKey: string | null;

    try {
      apiKey = algoliaClient.generateSecuredApiKey(algoliaSearchApiKey, {
        validUntil: Date.now() + 36060, // which is one minute over the TTL of the ID token
      });
    } catch (e) {
      apiKey = null;
      logger.error(e, 'Error during generating the key for Algolia search');
    }

    return {
      payload: {
        ...user,
        algoliaApiKey: apiKey,
      },
    };
  });
