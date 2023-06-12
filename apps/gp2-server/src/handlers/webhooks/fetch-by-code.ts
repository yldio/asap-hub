/* istanbul ignore file */
import { ValidationError } from '@asap-hub/errors';
import { gp2 } from '@asap-hub/model';
import { Logger, validateAuth0Request } from '@asap-hub/server-common';
import { framework as lambda } from '@asap-hub/services-common';
import { auth0SharedSecret } from '../../config';
import Users, { UserController } from '../../controllers/user.controller';
import {
  getAssetDataProvider,
  getUserDataProvider,
} from '../../dependencies/user.dependency';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';

export const fetchUserByCodeHandlerFactory = (
  userController: UserController,
  log: Logger,
): lambda.Handler =>
  lambda.http<gp2.UserResponse>(async (request) => {
    validateAuth0Request(request, auth0SharedSecret);

    const { code } = validateParams(request.params);

    try {
      const user = await userController.fetchByCode(code);

      return {
        payload: {
          ...user,
        },
      };
    } catch (err) {
      log.error(`An error occurred when fetching user with code: ${code}`);
      if (err instanceof Error) {
        log.error(`The error message: ${err.message}`);
      }
      throw err;
    }
  });

export type GetValidUntilTimestampInSecondsArgs = {
  date: Date;
  ttl: number;
};

const userDataProvider = getUserDataProvider();
const assetDataProvider = getAssetDataProvider();

/* istanbul ignore next */
export const handler = sentryWrapper(
  fetchUserByCodeHandlerFactory(
    new Users(userDataProvider, assetDataProvider),
    logger,
  ),
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
