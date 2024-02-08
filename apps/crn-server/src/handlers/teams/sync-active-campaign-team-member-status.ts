import { NotFoundError } from '@asap-hub/errors';
import { TeamEvent } from '@asap-hub/model';
import {
  createContact,
  EventBridgeHandler,
  getContactFieldValues,
  getContactIdByEmail,
  Logger,
  syncUserActiveCampaignData,
  updateContact,
} from '@asap-hub/server-common';
import { isBoom } from '@hapi/boom';

import type { TeamPayload } from '../event-bus';

import {
  getContactPayload,
  getFieldIdByTitle,
  updateContactLists,
} from '../user/sync-active-campaign-contact';

import { activeCampaignAccount, activeCampaignToken } from '../../config';
import TeamController from '../../controllers/team.controller';
import UserController from '../../controllers/user.controller';

export const syncActiveCampaignTeamMemberStatusFactory =
  (
    teamController: TeamController,
    userController: UserController,
    log: Logger,
  ): EventBridgeHandler<TeamEvent, TeamPayload> =>
  async (event) => {
    log.info(`Event ${event['detail-type']}`);

    /* istanbul ignore next */
    if (activeCampaignToken === '') {
      log.info('Active Campaign Token not defined, skipping...');
      return;
    }

    try {
      const team = await teamController.fetchById(event.detail.resourceId);
      log.info(`Fetched team ${team.id}`);

      for (const member of team.members) {
        await syncUserActiveCampaignData(
          'CRN',
          userController,
          member.id,
          log,
          getContactIdByEmail,
          createContact,
          updateContact,
          updateContactLists,
          activeCampaignAccount,
          activeCampaignToken,
          getContactPayload,
          getFieldIdByTitle,
          getContactFieldValues,
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
