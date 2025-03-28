import { getGraphQLClient as getContentfulGraphQLClient } from '@asap-hub/contentful';
import { gp2 } from '@asap-hub/model';
import { RateLimiter } from 'limiter';
import { DateTime } from 'luxon';
import {
  contentfulAccessToken,
  contentfulEnvId,
  contentfulSpaceId,
} from '../src/config';
import { UserContentfulDataProvider } from '../src/data-providers/user.data-provider';
import { getContentfulRestClientFactory } from '../src/dependencies/clients.dependency';

console.log('reseting users invitations...');

const contentfulGraphQLClient = getContentfulGraphQLClient({
  space: contentfulSpaceId,
  accessToken: contentfulAccessToken,
  environment: contentfulEnvId,
});

const uuidRegex =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

const userDataProvider = new UserContentfulDataProvider(
  contentfulGraphQLClient,
  getContentfulRestClientFactory,
);
const resetConnections = async ({ id }: gp2.UserDataObject) => {
  console.log(`resetting connection for user: ${id}`);
  try {
    await userDataProvider.update(id, {
      connections: [],
    });
  } catch (err) {
    console.error(`error while updating user ${id}`);
    if (err instanceof Error) {
      console.error(err.message);
    }
  }
};
const hasInviteConnection = ({ connections }: gp2.UserDataObject) =>
  connections?.length === 1 &&
  connections[0] &&
  uuidRegex.test(connections[0].code);
const recentlyUpdated = ({ lastModifiedDate }: gp2.UserDataObject) =>
  DateTime.fromISO(lastModifiedDate).diffNow('hours').get('hours') < -8;

const app = async () => {
  const rateLimiter = new RateLimiter({
    tokensPerInterval: 1,
    interval: 3000,
  });
  const take = 10;
  let numberOfInvitedUsers = 0;

  const processUsers = async (skip: number) => {
    await rateLimiter.removeTokens(1);
    const { total, items: users } = await userDataProvider.fetch({
      take,
      skip,
    });

    const usersToInvite = users
      .filter(recentlyUpdated)
      .filter(hasInviteConnection);

    for (const user of usersToInvite) {
      await rateLimiter.removeTokens(1);
      await resetConnections(user);
      numberOfInvitedUsers++;
      console.log(`number of users invited so far: ${numberOfInvitedUsers}`);
    }

    const next = skip + take;
    if (next < total) {
      await processUsers(next);
    }
  };
  console.log(`starting import for ${contentfulEnvId}`);
  await processUsers(0);
  console.log(`Invited ${numberOfInvitedUsers} users.`);
};

app().catch(console.error);
