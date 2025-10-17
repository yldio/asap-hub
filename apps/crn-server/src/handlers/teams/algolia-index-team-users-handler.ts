import {
  AlgoliaClient,
  algoliaSearchClientFactory,
  Payload,
} from '@asap-hub/algolia';
import {
  ListUserResponse,
  TeamEvent,
  TeamMembershipEvent,
} from '@asap-hub/model';
import {
  createProcessingFunction,
  loopOverCustomCollection,
  LoopOverCustomCollectionFetchOptions,
  userFilter,
} from '@asap-hub/server-common';
import { EventBridgeEvent } from 'aws-lambda';
import { algoliaApiKey, algoliaAppId, algoliaIndex } from '../../config';
import UserController from '../../controllers/user.controller';
import {
  getAssetDataProvider,
  getUserDataProvider,
  getResearchTagsDataProvider,
} from '../../dependencies/users.dependencies';
import logger from '../../utils/logger';
import { sentryWrapper } from '../../utils/sentry-wrapper';
import { TeamPayload } from '../event-bus';

type TeamMembershipPayload = {
  resourceId: string;
  fields: {
    team: {
      'en-US': {
        sys: {
          id: string;
        };
      };
    };
  };
};

export const indexTeamUsersHandler = (
  userController: UserController,
  algoliaClient: AlgoliaClient<'crn'>,
): ((
  event: EventBridgeEvent<
    TeamEvent | TeamMembershipEvent,
    TeamPayload | TeamMembershipPayload
  >,
) => Promise<void>) => {
  const processingFunction = createProcessingFunction<Payload, 'user'>(
    algoliaClient,
    'user',
    logger,
    userFilter,
  );
  return async (event) => {
    logger.debug(`Event ${event['detail-type']}`);

    // Extract team ID based on event type
    let teamId: string;

    if (event['detail-type'].startsWith('TeamMembership')) {
      // For TeamMembership events, extract team ID from the membership data
      const membershipPayload = event.detail as TeamMembershipPayload;
      teamId = membershipPayload.fields.team['en-US'].sys.id;
      logger.debug(`TeamMembership event - extracted team ID: ${teamId}`);
    } else {
      // For Team events, use the resourceId directly
      teamId = event.detail.resourceId;
      logger.debug(`Team event - using team ID: ${teamId}`);
    }

    const fetchFunction = ({
      skip,
      take,
    }: LoopOverCustomCollectionFetchOptions): Promise<ListUserResponse> =>
      userController.fetch({
        filter: {
          teamId,
        },
        skip,
        take,
      });

    await loopOverCustomCollection(fetchFunction, processingFunction, 8);
  };
};

const rawHandler = indexTeamUsersHandler(
  new UserController(
    getUserDataProvider(),
    getAssetDataProvider(),
    getResearchTagsDataProvider(),
  ),
  algoliaSearchClientFactory({ algoliaApiKey, algoliaAppId, algoliaIndex }),
);

/* istanbul ignore next */
export const handler = sentryWrapper(rawHandler);

export type UserIndexEventBridgeEvent = EventBridgeEvent<
  TeamEvent | TeamMembershipEvent,
  TeamPayload | TeamMembershipPayload
>;
