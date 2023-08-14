import { getGraphQLClient as getContentfulGraphQLClient } from '@asap-hub/contentful';
import { gp2 } from '@asap-hub/model';
import { RateLimiter } from 'limiter';
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
const hasInviteConnection = (user: gp2.UserDataObject) =>
  user.connections?.length === 1 &&
  user.connections[0] &&
  uuidRegex.test(user.connections[0].code);

const app = async () => {
  const rateLimiter = new RateLimiter({
    tokensPerInterval: 1,
    interval: 3000,
  });
  const take = 10;

  const processUsers = async (skip: number) => {
    await rateLimiter.removeTokens(1);
    const { total, items: users } = await userDataProvider.fetch({
      take,
      skip,
    });

    await Promise.all(
      users.filter(hasInviteConnection).map(async (user) => {
        await rateLimiter.removeTokens(1);
        await resetConnections(user);
      }),
    );

    const next = skip + take;
    if (next < total) {
      await processUsers(next);
    }
  };
  console.log(`starting import for ${contentfulEnvId}`);
  await processUsers(0);
};

app().catch(console.error);
