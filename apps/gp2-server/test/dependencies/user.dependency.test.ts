import { UserContentfulDataProvider } from '../../src/data-providers/user.data-provider';
import { getUserDataProvider } from '../../src/dependencies/user.dependency';
import { getContentfulGraphqlClientMock } from '../mocks/contentful-graphql-client.mock';
describe('Users Dependencies', () => {
  it('Should resolve User Contentful Data Provider when the Contentful feature flag is on', async () => {
    const graphQLClient = getContentfulGraphqlClientMock();
    const userDataProvider = getUserDataProvider(graphQLClient);

    expect(userDataProvider).toBeInstanceOf(UserContentfulDataProvider);
  });
});
