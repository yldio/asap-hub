describe('Users Dependencies', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe('getUserDataProvider', () => {
    it('Should resolve User Squidex Data Provider when the Contentful feature flag is off', async () => {
      process.env.IS_CONTENTFUL_ENABLED_V2 = 'false';

      const { UserSquidexDataProvider } = await import(
        '../../src/data-providers/users.data-provider'
      );
      const getDependenciesModule = await import(
        '../../src/dependencies/users.dependencies'
      );
      const userDataProvider = getDependenciesModule.getUserDataProvider();

      expect(userDataProvider).toBeInstanceOf(UserSquidexDataProvider);
    });

    it('Should resolve User Contentful Data Provider when the Contentful feature flag is on', async () => {
      process.env.IS_CONTENTFUL_ENABLED_V2 = 'true';
      const { UserContentfulDataProvider } = await import(
        '../../src/data-providers/contentful/users.data-provider'
      );
      const getDependenciesModule = await import(
        '../../src/dependencies/users.dependencies'
      );
      const userDataProvider = getDependenciesModule.getUserDataProvider();

      expect(userDataProvider).toBeInstanceOf(UserContentfulDataProvider);
    });
  });

  describe('getAssetDataProvider', () => {
    it('Should resolve Asset Squidex Data Provider when the Contentful feature flag is off', async () => {
      process.env.IS_CONTENTFUL_ENABLED_V2 = 'false';

      const { AssetSquidexDataProvider } = await import(
        '../../src/data-providers/assets.data-provider'
      );
      const getDependenciesModule = await import(
        '../../src/dependencies/users.dependencies'
      );
      const assetDataProvider = getDependenciesModule.getAssetDataProvider();

      expect(assetDataProvider).toBeInstanceOf(AssetSquidexDataProvider);
    });

    it('Should resolve Asset Contentful Data Provider when the Contentful feature flag is on', async () => {
      process.env.IS_CONTENTFUL_ENABLED_V2 = 'true';
      const { AssetContentfulDataProvider } = await import(
        '../../src/data-providers/contentful/assets.data-provider'
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
export {};
