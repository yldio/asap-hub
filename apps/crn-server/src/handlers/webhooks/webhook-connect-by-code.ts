import { UserResponse } from '@asap-hub/model';
import { connectByCodeHandlerFactory } from '@asap-hub/server-common';
import { framework as lambda } from '@asap-hub/services-common';
import { Handler } from 'aws-lambda';
import { auth0SharedSecret } from '../../config';
import Users from '../../controllers/user.controller';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import {
  getUserDataProvider,
  getAssetDataProvider,
} from '../../dependencies/users.dependencies';

const users = new Users(getUserDataProvider(), getAssetDataProvider());
const connectByCodeHandler = connectByCodeHandlerFactory<UserResponse>(
  users,
  auth0SharedSecret,
  logger,
);

export const unloggedHandler: lambda.Handler =
  lambda.http(connectByCodeHandler);

export const handler: Handler = sentryWrapper(unloggedHandler);
