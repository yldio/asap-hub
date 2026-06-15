import { ValidationError } from '@asap-hub/errors';
import { gp2 } from '@asap-hub/model';
import { validateAuth0Request } from '@asap-hub/server-common';
import { framework as lambda } from '@asap-hub/services-common';
import { SearchClient } from 'algoliasearch';
import {
  algoliaApiKey,
  algoliaApiKeyTtl,
  auth0SharedSecret,
} from '../../config';
import UserController from '../../controllers/user.controller';

export const fetchUserByCodeHandlerFactory = (
  userController: UserController,
  algoliaClient: Pick<SearchClient, 'generateSecuredApiKey'>,
  date = new Date(),
  ttl = algoliaApiKeyTtl,
): lambda.Handler =>
  lambda.http<gp2.UserMetadataResponse>(async (request) => {
    validateAuth0Request(request, auth0SharedSecret);

    const { code } = validateParams(request.params);

    const user = await userController.fetchByCode(code);
    const apiKey = user.onboarded
      ? await algoliaClient.generateSecuredApiKey({
          parentApiKey: algoliaApiKey,
          restrictions: {
            validUntil: getValidUntilTimestampInSeconds({
              date,
              ttl,
            }),
          },
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

const validateParams = (
  params:
    | {
        [key: string]: string;
      }
    | undefined,
): { code: string } => {
  if (params && 'code' in params && typeof params.code === 'string') {
    return { code: params.code };
  }

  throw new ValidationError(undefined, [], 'Missing params');
};
