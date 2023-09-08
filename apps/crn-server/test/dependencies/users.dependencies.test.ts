describe('Users Dependencies', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe('getUserDataProvider', () => {
    it('Should resolve User Contentful Data Provider', async () => {
      const { UserContentfulDataProvider } = await import(
        '../../src/data-providers/contentful/user.data-provider'
      );
      const getDependenciesModule = await import(
        '../../src/dependencies/users.dependencies'
      );
      const userDataProvider = getDependenciesModule.getUserDataProvider();

      expect(userDataProvider).toBeInstanceOf(UserContentfulDataProvider);
    });
  });

  describe('getAssetDataProvider', () => {
    it('Should resolve Asset Contentful Data Provider', async () => {
      const { AssetContentfulDataProvider } = await import(
        '../../src/data-providers/contentful/asset.data-provider'
      );
      const getDependenciesModule = await import(
        '../../src/dependencies/users.dependencies'
      );
      const assetDataProvider = getDependenciesModule.getAssetDataProvider();

      expect(assetDataProvider).toBeInstanceOf(AssetContentfulDataProvider);
    });
  });
});

// necessary to avoid " cannot be compiled under '--isolatedModules' because it is considered a global script file"
// eslint-disable-next-line jest/no-export
export {};
