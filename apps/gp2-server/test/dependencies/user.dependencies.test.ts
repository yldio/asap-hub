describe('Users Dependencies', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe('getUserDataProvider', () => {
    it('Should resolve User Squidex Data Provider when the Contentful feature flag is off', async () => {
      process.env.GP2_CONTENTFUL_ENABLED = 'false';

      const { UserSquidexDataProvider } = await import(
        '../../src/data-providers/user.data-provider'
      );
      const getDependenciesModule = await import(
        '../../src/dependencies/user.dependency'
      );
      const userDataProvider = getDependenciesModule.getUserDataProvider();

      expect(userDataProvider).toBeInstanceOf(UserSquidexDataProvider);
    });

    it('Should resolve User Contentful Data Provider when the Contentful feature flag is on', async () => {
      process.env.GP2_CONTENTFUL_ENABLED = 'true';
      const { UserContentfulDataProvider } = await import(
        '../../src/data-providers/contentful/user.data-provider'
      );
      const getDependenciesModule = await import(
        '../../src/dependencies/user.dependency'
      );
      const userDataProvider = getDependenciesModule.getUserDataProvider();

      expect(userDataProvider).toBeInstanceOf(UserContentfulDataProvider);
    });
  });

  describe('getAssetDataProvider', () => {
    it('Should return contentful data provider when the Contentful feature flag is on', async () => {
      process.env.GP2_CONTENTFUL_ENABLED = 'true';
      const { AssetContentfulDataProvider } = await import(
        '../../src/data-providers/contentful/asset.data-provider'
      );
      const getDependenciesModule = await import(
        '../../src/dependencies/user.dependency'
      );
      const assetDataProvider = getDependenciesModule.getAssetDataProvider();

      expect(assetDataProvider).toBeInstanceOf(AssetContentfulDataProvider);
    });

    it('Should return squidex data provider when the Contentful feature flag is off', async () => {
      process.env.GP2_CONTENTFUL_ENABLED = 'false';

      const { AssetSquidexDataProvider } = await import(
        '../../src/data-providers/asset.data-provider'
      );
      const getDependenciesModule = await import(
        '../../src/dependencies/user.dependency'
      );
      const assetDataProvider = getDependenciesModule.getAssetDataProvider();

      expect(assetDataProvider).toBeInstanceOf(AssetSquidexDataProvider);
    });
  });
});

// necessary to avoid " cannot be compiled under '--isolatedModules' because it is considered a global script file"
export {};
