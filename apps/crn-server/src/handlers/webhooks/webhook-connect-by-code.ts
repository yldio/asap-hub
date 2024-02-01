import { UserResponse } from '@asap-hub/model';
import { connectByCodeHandlerFactory } from '@asap-hub/server-common';
import { framework as lambda } from '@asap-hub/services-common';
import { Handler } from 'aws-lambda';
import { auth0SharedSecret } from '../../config';
import UserController from '../../controllers/user.controller';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import {
  getUserDataProvider,
  getAssetDataProvider,
  getResearchTagsDataProvider,
} from '../../dependencies/users.dependencies';

export const connectByCodeHandler = (users: UserController) =>
  lambda.http(
    connectByCodeHandlerFactory<UserResponse>(users, auth0SharedSecret, logger),
  );

export const unloggedHandler: lambda.Handler = connectByCodeHandler(
  new UserController(
    getUserDataProvider(),
    getAssetDataProvider(),
    getResearchTagsDataProvider(),
  ),
);

export const handler: Handler = sentryWrapper(unloggedHandler);
