import { AlgoliaClient, algoliaSearchClientFactory } from '@asap-hub/algolia';
import { TeamEvent, TeamListItemDataObject } from '@asap-hub/model';
import { EventBridgeHandler, TeamPayload } from '@asap-hub/server-common';
import { NotFoundError } from '@asap-hub/errors';
import { Boom, isBoom } from '@hapi/boom';
import { EventBridgeEvent } from 'aws-lambda';
import { algoliaApiKey, algoliaAppId, algoliaIndex } from '../../config';
import TeamController from '../../controllers/team.controller';
import { getTeamDataProvider } from '../../dependencies/team.dependencies';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';

/* istanbul ignore next */
export const indexTeamHandler =
  (
    teamController: TeamController,
    algoliaClient: AlgoliaClient<'crn'>,
  ): EventBridgeHandler<TeamEvent, TeamPayload> =>
  async (event) => {
    logger.debug(`Event ${event['detail-type']}`);
    const teamId = event.detail.resourceId;

    try {
      const team = await teamController.fetchById(teamId);

      logger.debug(`Fetched team ${teamId}`);

      if (team) {
        const {
          id,
          displayName,
          inactiveSince,
          projectTitle,
          labCount,
          expertiseAndResourceTags,
        } = team;
        await algoliaClient.save({
          data: {
            id,
            displayName,
            inactiveSince,
            projectTitle,
            labCount,
            expertiseAndResourceTags,
            memberCount: team.members.length,
            _tags: team.expertiseAndResourceTags,
          } as TeamListItemDataObject,
          type: 'team',
        });

        logger.debug(`Team saved ${teamId}`);
      } else {
        await algoliaClient.remove(teamId);

        logger.debug(`Team removed ${teamId}`);
      }
    } catch (e) {
      if (
        (isBoom(e) && (e as Boom).output.statusCode === 404) ||
        e instanceof NotFoundError
      ) {
        await algoliaClient.remove(teamId);

        logger.debug(`Team removed ${teamId}`);
        return;
      }

      logger.error(e, 'Error saving team to Algolia');
      throw e;
    }
  };

/* istanbul ignore next */
export const handler = sentryWrapper(
  indexTeamHandler(
    new TeamController(getTeamDataProvider()),
    algoliaSearchClientFactory({ algoliaApiKey, algoliaAppId, algoliaIndex }),
  ),
);

export type TeamIndexEventBridgeEvent = EventBridgeEvent<
  TeamEvent,
  TeamPayload
>;
