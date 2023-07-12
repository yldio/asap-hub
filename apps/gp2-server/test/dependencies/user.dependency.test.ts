import { UserContentfulDataProvider } from '../../src/data-providers/user.data-provider';
import { getUserDataProvider } from '../../src/dependencies/user.dependency';
describe('Users Dependencies', () => {
  it('Should resolve User Contentful Data Provider when the Contentful feature flag is on', async () => {
    const userDataProvider = getUserDataProvider();

    expect(userDataProvider).toBeInstanceOf(UserContentfulDataProvider);
  });
});
