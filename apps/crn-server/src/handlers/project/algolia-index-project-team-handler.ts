import {
  AlgoliaClient,
  algoliaSearchClientFactory,
  Payload,
} from '@asap-hub/algolia';
import { ListTeamResponse, ProjectEvent } from '@asap-hub/model';
import {
  createProcessingFunction,
  EventBridgeHandler,
  loopOverCustomCollection,
  LoopOverCustomCollectionFetchOptions,
} from '@asap-hub/server-common';

import TeamController from '../../controllers/team.controller';
import { getTeamDataProvider } from '../../dependencies/team.dependencies';

import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import { algoliaApiKey, algoliaAppId, algoliaIndex } from '../../config';
import { addTagsFunction } from '../helper';

/**
 * 1. Find the previously linked team in Algolia
 * 2. Find the currently linked team in Contentful
 * 3. Sync each unique teamId (no removal)
 */

export const indexTeamByProjectHandler =
  (
    teamController: TeamController,
    algoliaClient: AlgoliaClient<'crn'>,
  ): EventBridgeHandler<ProjectEvent, { resourceId: string }> =>
  async (event) => {
    const eventType = event['detail-type'] as
      | 'ProjectsPublished'
      | 'ProjectsUnpublished';
    const projectId = event.detail.resourceId;

    logger.debug(`Event ${eventType}`);

    try {
      const algoliaResult = await algoliaClient.search(['team'], projectId, {
        page: 0,
        hitsPerPage: 1,
        restrictSearchableAttributes: ['linkedProjectId'],
      });

      const previousTeamId = algoliaResult.hits[0]?.id;

      const newTeamId =
        eventType === 'ProjectsPublished'
          ? await teamController.fetchTeamIdByProjectId(projectId)
          : null;

      const linkedTeamIds = new Set<string>();
      if (previousTeamId) linkedTeamIds.add(previousTeamId);
      if (newTeamId) linkedTeamIds.add(newTeamId);

      if (linkedTeamIds.size === 0) {
        logger.debug(`No teams to sync for project with id ${projectId}`);
        return;
      }

      const fetchFunction = ({
        skip,
        take,
      }: LoopOverCustomCollectionFetchOptions): Promise<ListTeamResponse> =>
        teamController.fetch({
          skip,
          take,
          teamIds: [...linkedTeamIds],
        });

      const processingFunction = createProcessingFunction<Payload, 'team'>(
        algoliaClient,
        'team',
        logger,
        () => true,
        addTagsFunction<Payload>,
      );

      await loopOverCustomCollection(fetchFunction, processingFunction, 5);
      logger.debug(
        `Synced ${linkedTeamIds.size} team(s) for project with id ${projectId}`,
      );
    } catch (e) {
      logger.error(
        e,
        `Error updating team(s) linked to project with id ${projectId} in Algolia`,
      );
      throw e;
    }
  };

const teamDataProvider = getTeamDataProvider();

/* istanbul ignore next */
export const handler = sentryWrapper(
  indexTeamByProjectHandler(
    new TeamController(teamDataProvider),
    algoliaSearchClientFactory({ algoliaApiKey, algoliaAppId, algoliaIndex }),
  ),
);
