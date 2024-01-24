import { syncActiveCampaignContactFactory } from '@asap-hub/server-common';
import { activeCampaignAccount, activeCampaignToken } from '../../config';
import UserController from '../../controllers/user.controller';
import {
  getUserDataProvider,
  getAssetDataProvider,
} from '../../dependencies/users.dependencies';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';

const userDataProvider = getUserDataProvider();
const assetDataProvider = getAssetDataProvider();

export const handler = sentryWrapper(
  syncActiveCampaignContactFactory(
    new UserController(userDataProvider, assetDataProvider),
    logger,
    activeCampaignAccount,
    activeCampaignToken,
  ),
);
