import { framework as lambda } from '@asap-hub/services-common';
import { RestUser, SquidexGraphql, SquidexRest } from '@asap-hub/squidex';
import { ValidationError } from '@asap-hub/errors';
import { appName, baseUrl } from '../../config';
import validateRequest from '../../utils/validate-auth0-request';
import UserDataProvider from '../../data-providers/users.data-provider';
import Users, { UserController } from '../../controllers/user.controller';
import { getAuthToken } from '../../utils/auth';

export const fetchUserByCodeHandlerFactory = (
  userController: UserController,
): lambda.Handler =>
  lambda.http(async (request) => {
    await validateRequest(request);

    const { code } = validateParams(request.params);

    const user = await userController.fetchByCode(code);

    return {
      payload: {
        ...user,
      },
    };
  });

export type GetValidUntilTimestampInSecondsArgs = {
  date: Date;
  ttl: number;
};

const squidexGraphqlClient = new SquidexGraphql(getAuthToken, {
  appName,
  baseUrl,
});
const userRestClient = new SquidexRest<RestUser>(getAuthToken, 'users', {
  appName,
  baseUrl,
});
const userDataProvider = new UserDataProvider(
  squidexGraphqlClient,
  userRestClient,
);
export const handler = fetchUserByCodeHandlerFactory(
  new Users(userDataProvider),
);

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
