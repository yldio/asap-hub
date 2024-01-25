/* istanbul ignore file */
import { syncActiveCampaignContactFactory } from '@asap-hub/server-common';
import { activeCampaignAccount, activeCampaignToken } from '../../config';
import UserController from '../../controllers/user.controller';
import { AssetContentfulDataProvider } from '../../data-providers/asset.data-provider';
import { UserContentfulDataProvider } from '../../data-providers/user.data-provider';
import {
  getContentfulGraphQLClientFactory,
  getContentfulRestClientFactory,
} from '../../dependencies/clients.dependency';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';

const contentfulGraphQLClient = getContentfulGraphQLClientFactory();
const userDataProvider = new UserContentfulDataProvider(
  contentfulGraphQLClient,
  getContentfulRestClientFactory,
);
const assetDataProvider = new AssetContentfulDataProvider(
  getContentfulRestClientFactory,
);

export const handler = sentryWrapper(
  syncActiveCampaignContactFactory(
    new UserController(userDataProvider, assetDataProvider),
    logger,
    activeCampaignAccount,
    activeCampaignToken,
  ),
);
