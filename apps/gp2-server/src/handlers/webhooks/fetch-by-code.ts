/* istanbul ignore file */
import { ValidationError } from '@asap-hub/errors';
import { gp2 } from '@asap-hub/model';
import { validateAuth0Request } from '@asap-hub/server-common';
import { framework as lambda } from '@asap-hub/services-common';
import { gp2 as gp2squidex, SquidexRest } from '@asap-hub/squidex';
import { appName, auth0SharedSecret, baseUrl } from '../../config';
import Users, { UserController } from '../../controllers/user.controller';
import { AssetSquidexDataProvider } from '../../data-providers/asset.data-provider';
import { getUserDataProvider } from '../../dependencies/users.dependencies';
import { getAuthToken } from '../../utils/auth';
import { sentryWrapper } from '../../utils/sentry-wrapper';

export const fetchUserByCodeHandlerFactory = (
  userController: UserController,
): lambda.Handler =>
  lambda.http<gp2.UserResponse>(async (request) => {
    validateAuth0Request(request, auth0SharedSecret);

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

const userRestClient = new SquidexRest<
  gp2squidex.RestUser,
  gp2squidex.InputUser
>(getAuthToken, 'users', {
  appName,
  baseUrl,
});
const userDataProvider = getUserDataProvider();
const assetDataProvider = new AssetSquidexDataProvider(userRestClient);

/* istanbul ignore next */
export const handler = sentryWrapper(
  fetchUserByCodeHandlerFactory(new Users(userDataProvider, assetDataProvider)),
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
