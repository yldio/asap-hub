import { NotFoundError } from '@asap-hub/errors';
import { TeamEvent } from '@asap-hub/model';
import {
  ActiveCampaign,
  ActiveCampaignType,
  EventBridgeHandler,
  Logger,
  GetContactPayloadCRN,
  GetContactPayloadGP2,
  syncUserActiveCampaignData,
} from '@asap-hub/server-common';
import { isBoom } from '@hapi/boom';

import type { TeamPayload } from '../event-bus';
import {
  config,
  getContactPayload,
  listNames,
} from '../user/sync-active-campaign-contact';

import { activeCampaignToken } from '../../config';
import TeamController from '../../controllers/team.controller';
import UserController from '../../controllers/user.controller';
import { getTeamDataProvider } from '../../dependencies/team.dependencies';
import {
  getAssetDataProvider,
  getResearchTagsDataProvider,
  getUserDataProvider,
} from '../../dependencies/users.dependencies';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';

export const syncActiveCampaignTeamMemberStatusHandler =
  (
    teamController: TeamController,
    userController: UserController,
    log: Logger,
    syncTeamMemberData: (
      config: {
        app: 'CRN' | 'GP2';
        activeCampaignAccount: string;
        activeCampaignToken: string;
      },
      ActiveCampaign: ActiveCampaignType,
      userController: UserController,
      getContactPayload: GetContactPayloadCRN | GetContactPayloadGP2,
      listNames: string[],
      userId: string,
      log: Logger,
    ) => Promise<void>,
  ): EventBridgeHandler<TeamEvent, TeamPayload> =>
  async (event) => {
    log.info(`Event ${event['detail-type']}`);

    if (activeCampaignToken === '') {
      log.info('Active Campaign Token not defined, skipping...');
      return;
    }

    try {
      const team = await teamController.fetchById(event.detail.resourceId);
      log.info(`Fetched team ${team.id}`);

      for (const member of team.members) {
        await syncTeamMemberData(
          config,
          ActiveCampaign,
          userController,
          getContactPayload,
          listNames,
          member.id,
          log,
        );
      }
    } catch (e) {
      if (
        (isBoom(e) && e.output.statusCode === 404) ||
        e instanceof NotFoundError
      ) {
        log.info(e, 'Team not found');
        return;
      }

      log.info(
        e,
        `Error updating Active Campaign team ${event.detail.resourceId} members`,
      );
      throw e;
    }
  };

const userDataProvider = getUserDataProvider();
const assetDataProvider = getAssetDataProvider();
const researchTagDataProvider = getResearchTagsDataProvider();

export const handler = sentryWrapper(
  syncActiveCampaignTeamMemberStatusHandler(
    new TeamController(getTeamDataProvider()),
    new UserController(
      userDataProvider,
      assetDataProvider,
      researchTagDataProvider,
    ),
    logger,
    syncUserActiveCampaignData,
  ),
);
